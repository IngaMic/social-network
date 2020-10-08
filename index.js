const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });
const compression = require("compression");
const db = require("./db.js");
const bc = require("./bc.js");
const { sendEmail } = require("./ses");
const path = require("path");
const { hash } = require("bcryptjs");
const cookieSession = require("cookie-session");
const cryptoRandomString = require("crypto-random-string");
const csurf = require("csurf");
const { s3Url } = require("./config.json");
const uidSafe = require("uid-safe");
const s3 = require("./s3.js");
const multer = require("multer");
const { brotliDecompress } = require("zlib");

app.use(compression());
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//////////////////////////////////////////////////////////////////////////////////////
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

////////////////////////////////////////////////////////////////
// app.use(
//     cookieSession({
//         secret: `I'm always angry.`,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function (req, res, next) {
    console.log("token : ", req.csrfToken());
    res.cookie("mytoken", req.csrfToken());
    next();
});
//////////////No changes here ////////////////////////////////////
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
////////////////////////////////////////////////////////////////////

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
app.post("/welcome", (req, res) => {
    console.log("req.body :", req.body);
    first = req.body.first;
    last = req.body.last;
    email = req.body.email;
    //console.log("first, last ...", first, last, email);
    password = req.body.password;
    //console.log("password", password);
    bc.hash(password)
        .then((result) => {
            req.body.password = result;
            password = req.body.password;
            //console.log("password", password);
            db.getLogin(email)
                .then((result) => {
                    //console.log("result", result);
                    if (result.rows[0] && result.rows[0].id) {
                        //console.log("result", result);/////////////if somebody already registered with this email
                        console.log(
                            "Somebody already registered with this email"
                        );
                        res.json({
                            error: "Please try again",
                        });
                    } else {
                        if (
                            first === "" ||
                            last === "" ||
                            email === "" ||
                            password === ""
                        ) {
                            console.log(
                                "Not logging the registration data / empty"
                            );
                            res.json({
                                error: "Please try again",
                            });
                        } else {
                            db.registerUser(first, last, email, password)
                                .then((result) => {
                                    var userId = result.rows[0].id;
                                    //console.log("userid", userid);
                                    req.session.userId = userId; //registeredId
                                    res.json({
                                        success: "success",
                                        userId,
                                    });
                                })
                                .catch((err) => {
                                    console.log(
                                        "trouble with inserting registerUser data",
                                        err
                                    ); //getting error: relation "usersdata" does not exist
                                    res.json({
                                        error: "Please try again",
                                    });
                                });
                        }
                    }
                })
                .catch((err) => {
                    console.log(
                        "err in checking if email already registered in Registration",
                        err
                    );
                    res.json({
                        error: "Please try again",
                    });
                });
        })
        .catch((err) => {
            console.log("hash() didn't work", err);
            res.json({
                error: "Please try again",
            });
        });
});
app.post("/login", (req, res) => {
    console.log("req.body :", req.body);
    var email = req.body.email;
    var password = req.body.password;
    //console.log("password", password);
    db.getLogin(email)
        .then((result) => {
            if (result) {
                //console.log("result", result);
                var userId = result.rows[0].id;
                let pass = result.rows[0].password;
                console.log("pass   ", pass);
                console.log("password   ", password);
                bc.compare(password, pass)
                    .then((info) => {
                        console.log("info from compare", info);
                        if (info) {
                            //console.log("userId from here and now: ", userId);
                            req.session.userId = userId;
                            return res.json({
                                success: info,
                                userId: req.session.userId,
                            });
                        } else {
                            return res.json({
                                error: "Please try again",
                            });
                        }
                    })
                    .catch((err) => {
                        console.log("err in compare login", err);
                        return res.json({
                            error: "Please try again",
                        });
                    });
            }
            return;
        })
        .catch((err) => {
            console.log("err in getLogin", err);
            return res.json({
                error: "Please try again",
            });
        });
});
app.post("/reset", (req, res) => {
    //console.log("req.body :", req.body);
    var email = req.body.email;
    if (email == "") {
        return res.json({
            error: "Please try again",
        });
    } else {
        db.getLogin(email)
            .then((result) => {
                if (result) {
                    //console.log("result", result);
                    //let userId = result.rows[0].id;
                    var code = cryptoRandomString({ length: 6 });
                    db.addCode(email, code)
                        .then((info) => {
                            sendEmail(
                                "equatorial.pepperberry@spicedling.email",
                                "Reset Password",
                                `Your password reset code is : ${code}`
                            );
                            console.log("info : ", info);
                            return res.json({
                                email,
                                success: "success",
                            });
                        })
                        .catch((err) => {
                            console.log("err in addCode in /reset", err);
                            return res.json({
                                error: "Please try again",
                            });
                        });
                }
                return;
            })
            .catch((err) => {
                console.log("err in getLogin in /reset", err);
                return res.json({
                    error: "Please try again",
                });
            });
    }
});
app.post("/resetcode", (req, res) => {
    //console.log("req.body :", req.body);
    let email = req.body.email;
    var logCode = req.body.code;
    if (logCode == "") {
        return res.json({
            error: "Please try again",
        });
    } else {
        db.getCode(email)
            .then((result) => {
                if (result) {
                    console.log("result : ", result);
                    let code = result.rows[0].code;
                    if (logCode == code) {
                        return res.json({
                            email,
                            success: "success",
                        });
                    }
                    console.log("Stuck at code and logCode not being he same");
                    return res.json({
                        error: "Please try again",
                    });
                }
                console.log("stuck on getting result from getCode");
                return res.json({
                    error: "Please try again",
                });
            })
            .catch((err) => {
                console.log("err in getCode in /resetcode", err);
                return res.json({
                    error: "Please try again",
                });
            });
    }
});

app.post("/resetpassword", (req, res) => {
    let email = req.body.email;
    var newpassword = req.body.password;
    if (newpassword == "") {
        return res.json({
            error: "Please try again",
        });
    } else {
        bc.hash(newpassword)
            .then((result) => {
                req.body.password = result;
                password = req.body.password;
                //console.log("password", password);
                db.updatePassword(email, password)
                    .then((info) => {
                        // let userId = info.rows[0].id;
                        // req.session.userId = userId;
                        return res.json({
                            email,
                            success: "success",
                        });
                    })
                    .catch((err) => {
                        console.log("trouble with ", err);
                    });
            })
            .catch((err) =>
                console.log("hash() didn't work in /resetpassword", err)
            );
    }
});
app.get("/user", (req, res) => {
    console.log("req.session.userId", req.session.userId);
    if (req.session.userId) {
        let userId = req.session.userId;
        console.log("userId from /user ", userId);
        db.getUser(userId)
            .then((info) => {
                var list = info.rows;
                console.log("my list here   :", list);
                return res.json({
                    userId: list[0].id,
                    first: list[0].first,
                    last: list[0].last,
                    bio: list[0].bio,
                    imageUrl: list[0].imageurl,
                    email: list[0].email,
                });
            })
            .catch((err) => {
                console.log("err in getUser index.js", err);
            });
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
app.get("/user/:id.json", (req, res) => {
    const userId = req.params.id;
    if (userId) {
        // let id = req.params.id;
        // console.log("userId from /user ", id);
        db.getUser(userId)
            .then((info) => {
                var list = info.rows;
                console.log("my list here   :", list);
                return res.json({
                    userId: list[0].id,
                    first: list[0].first,
                    last: list[0].last,
                    bio: list[0].bio,
                    imageUrl: list[0].imageurl,
                    email: list[0].email,
                });
            })
            .catch((err) => {
                console.log("err in getUser index.js", err);
                return res.json({
                    error: "Please try again",
                });
            });
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
app.post("/uploadimg", uploader.single("file"), s3.upload, (req, res) => {
    //console.log("from /uploadimg req.body : ", req.body);
    let userId = req.session.userId;
    let filename = req.file.filename;
    //console.log("filename  :", filename);
    const url = `${s3Url}${filename}`;
    //console.log("URL    : ", url);
    db.updateImage(url, userId)
        .then((info) => {
            console.log("info after updateImage : ", info.rows[0].imageurl);
            return res.json({
                imageUrl: info.rows[0].imageurl,
                success: "success",
            });
        })
        .catch((err) => {
            console.log("trouble with updating /uploadimg", err);
        });
});
app.post("/uploadbio", (req, res) => {
    let userId = req.session.userId;
    //console.log("from /uploadbio req.body : ", req.body);
    let bio = req.body.bio;
    db.updateBio(bio, userId)
        .then((info) => {
            //console.log("info after updateBio : ", info);
            return res.json({
                bio: info.rows[0].bio,
                success: "success",
            });
        })
        .catch((err) => {
            console.log("trouble with updating /uploadbio", err);
        });
});
app.get("/api/users", async (req, res) => {
    try {
        const { userInput } = req.query;
        var users = [];
        if (!userInput) {
            const { rows } = await db.getUsers();
            users = rows;
        } else {
            const { rows } = await db.getUserSearch(userInput);
            users = rows;
        }
        res.json({
            users: users,
        });
    } catch (err) {
        console.log("err in getUsers get /users"), err;
    }
});
// app.get("/users/:userInput.json", (req, res) => {
//     const val = req.params.userInput;
//     console.log("val in get /users/:userInput.json :", val);
//     if (val) {
//         db.getUserSearch(val)
//             .then((info) => {
//                 console.log("info after getUserSeatch /users/:userInput", info);
//                 var users = info.rows;
//                 console.log("my users here   :", users);
//                 return res.json({
//                     users,
//                 });
//             })
//             .catch((err) => {
//                 console.log("err in getUserSearch index.js", err);
//             });
//     } else {
//         res.sendFile(__dirname + "/index.html");
//     }
// });

app.get("/api/friends", async (req, res) => {
    //console.log("I am getting a req in /friends");
    try {
        var userId = req.session.userId;
        var users = [];
        const { rows } = await db.getFriends(userId);
        users = rows;
        console.log("users from get /api/friends", users)
        res.json({
            users: users,
        });
    } catch (err) {
        console.log("err in getUsers get /friends"), err;
    }
});
app.get("/initial-friendship-status/:otherId", async (req, res) => {
    try {
        console.log("req.params", req.params);
        var otherId = req.params.otherId;
        var logUserId = req.session.userId;
        //console.log("userId and otherId", logUserId, otherId);
        var text = null;
        const { rows } = await db.checkFriendship(otherId, logUserId);
        console.log("rows from initial=friendship=status :", rows);
        if (rows.length == 0) {
            text = "Send Friend Request";
        } else if (logUserId == rows[0].sender_id && !rows[0].accepted) {
            //console.log("should cancel friend req");
            text = "Cancel Friend Request";
        } else if (logUserId == rows[0].recipient_id && !rows[0].accepted) {
            //console.log("should accept friend req");
            text = "Accept Friend Request";
        } else if (rows[0].accepted) {
            text = "End Friendship";
        }
        //console.log("text before :", text);
        res.json({
            text: text,
        });
    } catch (err) {
        console.log("err in post /initial friendship status"), err;
    }
});
app.post("/api/send-friend-request/:otherId", async (req, res) => {
    try {
        var otherId = req.params.otherId;
        var logUserId = req.session.userId;
        var text = null;
        const { rows } = await db.addFriendRequest(otherId, logUserId);
        console.log("rows from send-friend-req :", rows);
        if (rows.length == 1) {
            text = "Cancel Friend Request";
        }
        res.json({
            text: text,
        });
    } catch (err) {
        console.log("err in post /send friend req"), err;
    }
});
app.post("/api/accept-friend-request/:otherId", async (req, res) => {
    try {
        console.log("I am getting a req when updating to friends")
        var otherId = req.params.otherId;
        console.log("otherId from accept-friend index.js", otherId);
        var logUserId = req.session.userId;
        //console.log("logUserId from index.js", logUserId);
        var text = null;
        const { rows } = await db.friendshipUpdate(otherId, logUserId);
        console.log("rows from /accept-friend-request :", rows);
        if (rows[0].accepted) {
            text = "End Friendship";
        }
        res.json({
            text: text,
        });
    } catch (err) {
        console.log("err in getUsers post accept friend", err)
    }
});
app.post("/api/end-friendship/:otherId", async (req, res) => {
    try {
        var otherId = req.params.otherId;
        console.log("otherId from end-friendship index.js", otherId);
        var logUserId = req.session.userId;
        console.log("logUserId from end friendship index.js", logUserId);
        var text = null;
        const { rows } = await db.endFriendship(otherId, logUserId);
        console.log("rows from /end-friendship :", rows);
        if (rows.length == 0) {
            text = "Send Friend Request";
        }
        res.json({
            text: text,
        });
    } catch (err) {
        console.log("err in end friendship post "), err;
    }
});

// //the problem with a socket.io - all the communication after that is not HTTP = so there are no cookies
// //another problematic case could be having more than one server...
// io.on('connection', function (socket) {
//     //const {userId} = socket.request.session;

//     console.log(`socket with the id ${socket.id} is now connected`);

//     socket.on('disconnect', function () {
//         console.log(`socket with the id ${socket.id} is now disconnected`);
//     });

//     socket.on('thanks', function (data) {
//         console.log(data);
//     });
//     socket.on("greetingClicked", function (data) {
//         console.log(data);
//         socket.emit("funckyChicken", {
//             chicken: "Chic Chic Chic"
//         });
//         /////////////two ways to send message to all connected clients
//         /////////1:
//         io.emit("discoDuck", {
//             duck: "Quack Quack"
//         })
//         /////////2 (and we will not use it) :
//         // socket.broadcast.emit("discoDuck", {
//         //     duck: "Quack Quack"
//         // })
//         /////////3 (for private messages) :
//         ///////////you need to know a soclet id
//         // io.sockets.sockets[  mySocketId  ].emit("discoDuck", {
//         //     duck: "Quack Quack"
//         // })
//     });

//     socket.emit('welcome', {
//         message: 'Welome. It is nice to see you'
//     });
// });

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
/////////////////////////////////////////////////////////////////////

server.listen(8080, function () {
    console.log("server is listening...");
});
////////////////////////////////////////////////////////////////////
var onlineUsers = {};
io.on("connection", function (socket) {
    console.log(`socket.id ${socket.id} is now connected`);
    const userId = socket.request.session.userId;
    if (!socket.request.session.userId) {
        return socket.disconnect(true);

    } else {
        onlineUsers[socket.id] = userId;
        var arr = Object.values(onlineUsers);
        console.log("My array of users ids in sockets : ", arr);
        db.getUsersByIds(arr).then(({ rows }) => {
            console.log("these are my rows after getUsersByIds in index.js", rows.reverse());
            io.sockets.emit("onlineusers", rows);
        }).catch((err) => console.log("err in db.getUsersByIds", err))

    }

    socket.on("disconnect", () => {
        var disconectedId = onlineUsers[socket.id];
        //console.log("disconedtedId when user leaves: ", disconectedId);
        delete onlineUsers[socket.id];
        //console.log("onlineUsers after the user leaves :", onlineUsers)
        var arr = Object.values(onlineUsers);
        //console.log("My array of users ids in sockets : ", arr);
        if (!Object.values(onlineUsers).includes(disconectedId)) {
            db.getUsersByIds(arr).then(({ rows }) => {
                //console.log("these are my rows after getUsersByIds in index.js", rows.reverse());
                io.sockets.emit("userleft", rows);
            }).catch((err) => console.log("err in db.getUsersByIds", err))
        }
    });

    // a good place to retrieve out last 10 chat messages // kicks in after the user logs-in; all code inside this io.on(.....)
    //inside .then( we are going to emit the event for socket.js) -> then dispatch an action(.js) => reducer -> add it to redux
    db.getChatMessages().then(({ rows }) => {
        // console.log("these are my rows after getChatMessages in index.js", rows.reverse());
        //var msgs = rows.reverse();
        io.sockets.emit("chatMessages", rows);
    });

    //1srg = event that comes from chat.js
    //2arg info that comes along with the emit:
    socket.on("message", newMsg => {
        //console.log("This message is comming from chat.js component :", newMsg);
        //console.log("users who sent this newMsg id :", socket.request.session.userId);
        db.addMessage(socket.request.session.userId, newMsg).then(({ rows }) => {
            // console.log("these are my rows after addMessage in index.js", rows)
            db.getUser(socket.request.session.userId).then((info) => {
                var list = info.rows;
                // console.log("my list here after getUser in message handling indez.js :", list);
                var message = {
                    first: list[0].first,
                    last: list[0].last,
                    imageurl: list[0].imageurl,
                    message: rows[0].message,
                }
                //console.log(" newly constructed message in index.js :", message);
                io.sockets.emit("chatMessage", message);
            }).catch(err => console.log(err))
            //now we can do a new db.addMessage to chats
            // now we do db.getUser (first, last, imageurl)
            //make sure your new chat message object looks like the one we receive from the first 10msg
            //when object is there (last10) we emit it for users to see:
        }).catch(err => console.log("error in addMessage :", err))
    })
})