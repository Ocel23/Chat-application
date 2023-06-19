const express = require("express");
const expressSession= require("express-session");
const nodemailer = require("nodemailer");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});
const port = 5000;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//nadefinujeme knihovny

require("./cors")(app);

app.use(express.json())
//automaticky každý route je parsován do json
app.use(expressSession({
    secret: "a/#$sd#0$",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true
    }
}));

const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).send("Nemáte na tohle oprávnění!")
    }
    next();
}

//připojíme databázi
mongoose.connect('mongodb://127.0.0.1:27017/chatapp', { useNewUrlParser: true })
    .then(console.log("Connect to database"))
    .catch((err) => console.log("Can not connect to database Error message: " + err))

server.listen(port, () => {
    console.log("Listening on port " + port)
})

//vytvoříme šablony objektů v dabázi
const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        index: {unique: true}
    },
    passwordHash: String,
    isOnline: Boolean
})


const conversationSchema = new mongoose.Schema({
    user_ID: [mongoose.Schema.Types.ObjectId],
    id_of_room: String,
    dateAdded: {
        type: Date,
        default: Date.now
    }
})



//vytvoříme modely
const Conversation = mongoose.model("conversation", conversationSchema);
const User = mongoose.model("user", userSchema);


//POST požadavek na konverzace
app.post("/api/conversations", (req, res) => {
    Conversation.create(req.body)
        .then(result => res.send(result))
        .catch((err) => res.send("Požadavek na vytvoření konverzace selhal!" + err))
})

//GET požadavek na konverzace
app.get("/api/conversations", (req, res) => {
    Conversation.find()
        .then(result => res.send(result))
        .catch(() => res.send("Nebylo možné získat údaje o konverzacích!"));
})

//GET požadavek na konverzaci
/*
app.get("/api/conversations/:id", (req, res) => {
    Conversation.findById(req.params.id)
        .then(result => {
            if (result) {
                res.send(result);
            } else {
                res.status(404).send("Konverzace nebyla nalezena!")
            }
            
        })
        .catch(() => res.send("Nebylo možné získat údaje o konverzaci!"));
})
*/
app.delete("/api/conversations/:room", (req, res) => {
    Conversation.findOne().where("id_of_room").equals(req.params.room)
        .then(conversation => {
            if (conversation) {
                Conversation.findByIdAndDelete(conversation._id)
                    .then(result => {
                        res.send(result);
                    })
                    .catch(() => {
                        res.send("Chyba při mazání filmu.")
                    })
            } else {
                res.status(404).send("Konverzace nebyla nalezena!")
            }
        })
})
//LOGIN SYSTEM

//POST požadavek registraci


app.post("/user/register", (req, res) => {
    const users = User.findOne().where("isAdmin").equals(true)
       
            
            const userData = req.body;
            const saltRounds = 10;

            const createdUser = {
            email: userData.email,
            passwordHash: bcrypt.hashSync(userData.password, saltRounds),
            isOnline: false
        }

        User.create(createdUser)
            .then(savedUser => {
                const result = savedUser.toObject();
                delete result.passwordHash;
                res.send(result);
            })
            .catch(() => res.send("Požadavek na uložení uživatele selhal!"))    
        })


//POST požadavek na login

app.post("/user/login", (req, res) => {
    const {email, password} = req.body;
  
    User.findOne().where("email").equals(email)
        .then(user => {
            if (user || bcrypt.compareSync(password, user.passwordHash) || password === user.passwordHash) {
                const sessionUser = user.toObject();
                delete sessionUser.passwordHash;
                req.session.user = sessionUser;
                req.session.save(err => {
                    if (err) {
                        return res.status(500).send("Nastal chyba při přihlašování!")
                    }
                    const sessionData = {
                        _id: user.id,
                        email: user.email,
                        isOnline: user.isOnline
                    }
                    res.send(sessionData);
                })  
            } else {
                return res.status(400).send("Email nebo heslo nenalezeno")  
            }
          
            
        })
        .catch(() => res.status(500).send("Email nebyl nalezen!"))
})

//GET požadavek na login

app.get("/user/login",  (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).send("Nejsi přihlášen!")
    }
    res.send(user);
})

//DELETE požadavek na login
app.delete("/user/login", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).send("Chyba při mazání session!")
        }
        res.send("Uživatel odhlášen.")
    })
})

app.get("/users/online", (req, res) => {
    User.find().where("isOnline").equals(true)
        .then(user => {
            if (user) {
                res.send(user);
            } else {
                res.status(404).send("Žádný uživatel není online.")
            }
        })
        .catch(() => {
            res.send("Nebylo možné získat údaje o přihlášených uživatelých");
        })
})

app.put("/users/online/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
        .then(user => {
            if (user) {
                const result = user.toObject();
                delete result.passwordHash;
                res.send(result);
            } else {
                res.status(404).send("Uživatel nebyl nalezen!")
            }
        })
        .catch(() =>{
            res.send("Při změně stavu uživatele nastala se stala chyba.")
        })
})

/*
app.get("/users/online/:id", (req, res) => {
    const user = req.session.user;
    if (user) {
        res.send({
            isOnline: true
        })
    } else {
        res.send({
            isOnline: false
        })
    }
})
*/

//socket
io.of("/chat").on("connection", socket => {
        console.log("User connected with id" + socket.id);
        const {roomID} = socket.handshake.query;
        if (roomID) {
            socket.join(roomID);
            console.log("user was connected to the room " + roomID);
        }
        socket.on("message", data => {
            console.log("message was recived")
            io.of("/chat").to(roomID).emit("message-response", data);
        })

        socket.on("disconnect", socket => {
            console.log("User was disconnected");
        })
})

//email

app.post("/email/send", (req, res) => {
    const {email, subject, message} = req.body;
    const user = "ocel23dev@gmail.com";
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: 'OAuth2',
            user: user,
            clientId: '645479061279-2i9uedbf2ddtkiaro4dqhtf9u3t1436o.apps.googleusercontent.com',
            clientSecret: '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',
            refreshToken: '1//04BsPsgKj-tGCCgYIARAAGAQSNwF-L9IrOZWMWpxy_wHgzKV7qtJZu0KP83y2T2qW0o2JT0GLDF6hwGchlqmdVeho8z5_dY9qQfo',
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    
    const mailOptions = {
        from: user,
        to: email,
        subject: subject,
        text: message
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            res.status(500).send("Email nebylo možné odeslat.")
        } else {
            res.json(info.response);
        }
    })
    
    
})