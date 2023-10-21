const express = require("express");
const expressSession= require("express-session");
const nodemailer = require("nodemailer");
const chalk = require("chalk-v2");
const app = express();
//env data
require("dotenv").config();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: [process.env.NODEJS_HOST_DEPLOY_ADDRESS],
    },
});

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const MongoStore = require("connect-mongo");
//add libraries

require("./cors")(app);

//convert each response data to json
app.use(express.json())

app.set("trust proxy", 1);

app.use(expressSession({
    secret: "a/#$sd#0$",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_DB_ADRESS, touchAfter: 24 * 3600}),
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "none"
    }
}));

//function for requireAuth
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).send("You don't have permission to do this.")
    }
    next();
}

//connect to db
mongoose.connect(process.env.MONGO_DB_ADRESS, { useNewUrlParser: true })
    .then(console.log(chalk.green("Connected to database.")))
    .catch((err) => console.log(chalk.red("Cannot connected to database") + err))

server.listen(process.env.PORT_OF_SERVER, () => {
    console.log(chalk.yellow("Listening on port ") + process.env.PORT_OF_SERVER)
})

//create schemas for documents in collection
const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        index: {unique: true}
    },
    passwordHash: String,
    isOnline: Boolean
})

const conversationSchema = new mongoose.Schema({
    id_of_room: String,
    users: Number,
    dateAdded: {
        type: Date,
        default: Date.now
    },
})

const messageSchema = new mongoose.Schema({
    text: String,
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversation"
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    senderIsAdmin: Boolean
})

const statisticsSchema = new mongoose.Schema({
    onlineConversations: Number,
    todayConversations: Number,
    countOfCreatedConversations: Number,
    dateOfLastCreatedConversation: {
        type: Date,
        default: Date.now
    },
})

//create models
const Conversation = mongoose.model("conversation", conversationSchema);
const User = mongoose.model("user", userSchema);
const Message = mongoose.model("message", messageSchema);
const Statistics = mongoose.model("statistics", statisticsSchema)


//POST request for conversations
app.post("/api/conversations", (req, res) => {
    Conversation.create(req.body)
        .then(result => res.send(result))
        .catch(() => res.send("Could not create conversation"))
})

//GET request for conversations
app.get("/api/conversations", (req, res) => {
    Conversation.find()
        .then(result => res.send(result))
        .catch(() => res.send("Conversion data could not be retrieved"));
})

//PUT request for conversations

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

//DELETE request for conversations
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

//GET  request for conversations by room
app.get("/api/conversations/:room", (req, res) => {
    Conversation.findOne().where("id_of_room").equals(req.params.room)
        .then(conversation => {
           res.json(conversation);
        })
        .catch(() => res.status(404).send("Conversation was not found"))
})

//GET request for conversations messages
app.post("/api/conversationMessages", (req, res) => {
    Message.create(req.body)
        .then(result => {
            res.send(result);
        })
        .catch(() => {
            res.send("Could not create message");
        })
});

//GET request for messages by room id

app.get("/api/conversationMessages/:conversationID", (req, res) => {
    Message.find().where("room").equals(req.params.conversationID)
    .then((messages) => {
        res.send(messages);
    })
    .catch(() => {
        res.status(404).send("No messages with this room id was not found")
    })
})

//DELETE request for messages by room id
app.delete("/api/conversationMessages/:conversationID", (req, res) => {
    Message.deleteMany().where("room").equals(req.params.conversationID)
    .then((messages) => {
        res.send(messages);
    })
    .catch(() => {
        res.status(404).send("No messages with this room id was not found")
    })
})

//LOGIN SYSTEM

//POST požadavek registraci
app.post("/user/register", (req, res) => {
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
        res.send({message: "You are logged out."});
    })
})

//GET requ est for online users
app.get("/users/online", (req, res) => {
    User.findOne().where("isOnline").equals(true)
        .then((user) => {
            if (user) {
                res.send({ message: "Is online" });
            } else {
                res.status(404).send("No admin is online");
            }
        })
        .catch((error) => {
            res.status(500).send("Error while fetching online users: " + error.message);
        });
})

//PUT request for online user by id
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
            socket.join(roomID);
        }
        socket.on("message", data => {
            io.of("/chat").to(roomID).emit("message-response", data);
        })
        socket.on("cancel-conversation", message => {
            io.of("chat").to(roomID).emit("cancel-conversation", message);
        })
})

//email
app.post("/email/send", (req, res) => {
    const {email, subject, message} = req.body;
    const user = process.env.USER_EMAIL_ADDRESS;
    const transporter = nodemailer.createTransport({
        pool: Boolean(process.env.EMAIL_POOL) || false,
        host: process.env.EMAIL_HOST_ADRESS,
        port: parseInt(process.env.EMAIL_HOST_PORT),
        secure: Boolean(process.env.EMAIL_HOST_SECURE) || true,
        auth: {
            user: process.env.EMAIL_AUTH_USERNAME || null,
            pass: process.env.EMAIL_AUTH_PASSWORD || null,
        },
        tls: {
            rejectUnauthorized: process.env.TLS_REJECT || false
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

//statistics
app.get("/statistics/", (req, res) => {
    Statistics.find()
        .then(statistics => {
            res.send(statistics);
        })
        .catch(() => {
            res.send("Statistics information could not be loaded");
        })
})

app.put("/statistics/:id", (req, res) => {
    Statistics.findByIdAndUpdate(req.params.id, req.body)
        .then(statistics => {
            res.send(statistics);
        })
    .catch(() => {
            res.send("Statistics could not updated");
    }) 
})

app.post("/statistics", (req, res) => {
    Statistics.create(req.body)
        .then(statistics => {
                res.send(statistics);
        })
        .catch(() => res.send("Statistics could not created."));  
})

//yargs

async function fetchData(url, requestOptions) {
    const allRequestOptions = {credentials: "include", ...requestOptions};
    try {
        const data = await fetch(url, allRequestOptions)
        if (!data.ok) {
            throw new requestError(data);
        }
        return data.json();
    } catch(err) {
        throw err;
    }
}

function apiPost(url, data) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions)
}

const yargs = require("yargs");
const { emitWarning } = require("process");

yargs
    .command("register", "register admin to db", (yargs) => {
        yargs.positional("email", {
            describe: "email of user",
            type: "string"
        }),
        yargs.positional("password", {
            describe: "password of user",
            type: "string"
        })
        }, (argv) => {
            async function registerAdmin() {
                try {
                    await apiPost(`${process.env.NODEJS_BE_ADDRESS}/user/register`, {
                        email: argv.email,
                        password: argv.password
                    });
                    console.log(chalk.green("User successfully created."));
                } catch (err) {
                    return console.log(err);
                }
            }
            registerAdmin();
        }).argv
    
yargs
    .command("setup", "create files to apps in db", () => {
        
    }, (argv) => {
        async function createAppFiles() {
            try {
                await apiPost(`${process.env.NODEJS_BE_ADDRESS}/statistics`, {
                    onlineConversations: 0,
                    todayConversations: 0,
                    countOfCreatedConversations: 0,
                });
                console.log(chalk.green("All files for app was successfully created."));
            } catch (err) {
                return console.log(err);
            }
        }
        createAppFiles();
    }).argv;