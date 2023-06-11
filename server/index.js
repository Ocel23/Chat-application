const express = require("express");
const expressSession= require("express-session");
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
})


const conversationSchema = new mongoose.Schema({
    user_ID: [mongoose.Schema.Types.ObjectId],
    id_of_room: Number,
    dateAdded: {
        type: Date,
        default: Date.now
    }
})

//vytvoříme modely
const Conversation = mongoose.model("conversation", conversationSchema);
const User = mongoose.model("user", userSchema);

//POST požadavek na konverzace
app.post("/api/conversations", requireAuth, (req, res) => {
    Conversation.create(req.body)
        .then(result => res.send(result))
        .catch(() => res.send("Požadavek na vytvoření konverzace selhal!"))
})

//GET požadavek na konverzace
app.get("/api/conversations", requireAuth, (req, res) => {
    Conversation.find()
        .then(result => res.send(result))
        .catch(() => res.send("Nebylo možné získat údaje o konverzacích!"));
})

//GET požadavek na konverzaci
app.get("/api/conversations/:id", requireAuth, (req, res) => {
    Conversation.findById(req.params.id)
        .then(result => {
            if (result) {
                res.send(result);
            } else {
                res.status(404).send("Converzace nebyla nalezena!")
            }
            
        })
        .catch(() => res.send("Nebylo možné získat údaje o konverzaci!"));
})

//LOGIN SYSTEM

//POST požadavek registraci

/*
app.post("/user/register", (req, res) => {
    const users = User.findOne().where("isAdmin").equals(true)
       
            
            const userData = req.body;
            const saltRounds = 10;

            const createdUser = {
            email: userData.email,
            passwordHash: bcrypt.hashSync(userData.password, saltRounds),
            isAdmin: false
        }

        User.create(createdUser)
            .then(savedUser => {
                const result = savedUser.toObject();
                delete result.passwordHash;
                res.send(result);
            })
            .catch(() => res.send("Požadavek na uložení uživatele selhal!"))    
        })
*/

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
                        isAdmin: user.isAdmin
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
