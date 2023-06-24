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
        return res.status(403).send("You don't have permission to do this.")
    }
    next();
}

//připojíme databázi
mongoose.connect('mongodb://127.0.0.1:27017/chatapp', { useNewUrlParser: true })
    .then(console.log("Connected to database."))
    .catch((err) => console.log("Cannot connected to database. " + err))

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
    users: Number,
    dateAdded: {
        type: Date,
        default: Date.now
    }
})

const messageSchema = new mongoose.Schema({
    text: String,
    id_of_room: String,
    dateAdded: {
        type: Date,
        default: Date.now
    },
})


//vytvoříme modely
const Conversation = mongoose.model("conversation", conversationSchema);
const User = mongoose.model("user", userSchema);
const Message = mongoose.model("message", messageSchema);


//POST požadavek na konverzace
app.post("/api/conversations", (req, res) => {
    Conversation.create(req.body)
        .then(result => res.send(result))
        .catch(() => res.send("Could not create conversation"))
})

//GET požadavek na konverzace
app.get("/api/conversations", (req, res) => {
    Conversation.find()
        .then(result => res.send(result))
        .catch(() => res.send("Conversion data could not be retrieved"));
})

//GET požadavek na konverzaci

app.put("/api/conversations/:room", (req, res) => {
    Conversation.findOne().where("id_of_room").equals(req.params.room)
        .then((conversation) => {
            Conversation.findByIdAndUpdate(conversation._id, req.body)
                .then(result => {
                    res.send(result);
                })
                .catch(() => res.send("Conversation could not updated"));    
        })
        .catch(() => res.status(404).send("Conversation was not found"));
    
})

app.delete("/api/conversations/:room", (req, res) => {
    Conversation.findOne().where("id_of_room").equals(req.params.room)
        .then(conversation => {
            Conversation.findByIdAndDelete(conversation._id)
                .then(result => {
                    res.send(result);
                })
                .catch(() => {
                    res.send("Conversation could not deleted")
                })
        })
        .catch(() => {
            res.status(404).send("Conversation was not found")
        })
})

app.get("/api/conversations/:room", (req, res) => {
    Conversation.findOne().where("id_of_room").equals(req.params.room)
        .then(conversation => {
           res.json(conversation);
        })
        .catch(() => res.status(404).send("Conversation was not found"))
})

app.post("/api/conversationMessages", (req, res) => {
    Message.create(req.body)
        .then(result => {
            res.send(result);
        })
        .catch(() => {
            res.send("Could not create message");
        })
});

//později přistupovat přes objekt konverzace v databázi místo předání id roomky

app.get("/api/conversationMessages/:roomID", (req, res) => {
    Message.find().where("id_of_room").equals(req.params.roomID)
        .then(result => {
            res.send(result);
        })
        .catch(() => {
            res.status(404).send("Could not find any message from this room")
        })
})


app.delete("/api/conversationMessages/:roomID", (req, res) => {
    Message.deleteMany().where("id_of_room").equals(req.params.roomID)
        .then(result => {
            res.send(result);
        })
        .catch(() => {
            res.status(404).send("No message with this room id was not found")
        })
})

app.delete("/api/conversationMessages", (req, res) => {
    Message.deleteMany()
        .then(result => {
            res.send(result);
        })
        .catch(() => {
            res.send("Cannot delete all messages")
        })
})
//LOGIN SYSTEM

//POST požadavek registraci


app.post("/user/register", (req, res) => {
   User.findOne().where("isAdmin").equals(true)
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
            .catch(() => res.send("User could not saved"))    
        })

//POST požadavek na login

app.post("/user/login", (req, res) => {
    const {email, password} = req.body;
  
    User.findOne().where("email").equals(email)
        .then(user => {
            if (bcrypt.compareSync(password, user.passwordHash)) {
                const sessionUser = user.toObject();
                delete sessionUser.passwordHash;
                req.session.user = sessionUser;
                req.session.save(err => {
                    if (err) {
                        return res.status(500).send("An error occurred while logging in.")
                    }
                    const sessionData = {
                        _id: user.id,
                        email: user.email,
                        isOnline: user.isOnline
                    }
                    res.send(sessionData);
                })  
            } else {
                return res.status(400).send("Incorrect password"); 
            }
        })
        .catch(() => res.status(500).send("Email could not found"));
})

//GET požadavek na login

app.get("/user/login",  (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).send("You're not logged in")
    }
    res.send(user);
})

//DELETE požadavek na login
app.delete("/user/login", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).send("There was an error logging out")
        }
        res.send("User was log out")
    })
})

app.get("/users/online", (req, res) => {
    User.findOne().where("isOnline").equals(true)
        .then(user => {
            res.send(user);
        })
        .catch(() => {
            res.status(404).send("No admin is not online");
        })
})

app.put("/users/online/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
        .then(user => {
            res.send(user);
        })
        .catch(() =>{
            res.send("The user status could not be changed")
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
        const {roomID} = socket.handshake.query;
        if (roomID) {
            console.log("User connected with id" + socket.id);
            socket.join(roomID);
            console.log("User was connected to the room: " + roomID);
        }
        socket.on("message", data => {
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
            res.status(500).send("Email could not send")
        } else {
            res.json(info.response);
        }
    })
    
    
})