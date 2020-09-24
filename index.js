const express = require("express");
const app = express();
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
const s3 = require("./s3.js");
const multer = require("multer");
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
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
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
                    imageUrl: list[0].imageUrl,
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

app.post("/uploadimg", uploader.single("file"), s3.upload, (req, res) => {
    let userId = req.session.userId;
    console.log("from /uploadimg req.body : ", req.body);
    //let filename = req.body.filename;
    //console.log("filename  :", filename);
    const url = `${s3Url}${filename}`;
    console.log("URL    : ", url);
    db.updateImage(url, userId)
        .then((info) => {
            console.log("info after updateImage : ", info);
            return res.json({
                imageUrl: info.rows[0].imageUrl,
                success: "success",
            });
        })
        .catch((err) => {
            console.log("trouble with updating /uploadimg", err);
        });
});
app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
/////////////////////////////////////////////////////////////////////

app.listen(8080, function () {
    console.log("server is listening...");
});
