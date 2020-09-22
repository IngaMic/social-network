const express = require('express');
const app = express();
const compression = require('compression');
const db = require("./db.js");
const bc = require("./bc.js");
//const path = require('path');
//const { hash } = require("bcryptjs");
const cookieSession = require('cookie-session');
app.use(compression());
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//////////////////////////////////////////////////////////////////////////////////////
if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

////////////////////////////////////////////////////////////////
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);


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
    bc.hash(password).then((result) => {
        req.body.password = result;
        password = req.body.password
        //console.log("password", password);
        db.getLogin(email).then((result) => {
            //console.log("result", result);
            if (result.rows[0] && result.rows[0].id) {
                //console.log("result", result);/////////////if somebody already registered with this email
                console.log("Somebody already registered with this email");
            } else {
                if (first === "" || last === "" || email === "" || password === "") {
                    console.log("Not logging the registration data / empty");
                    res.json({
                        error: "Please try again",
                    });
                }
                else {
                    db.registerUser(first, last, email, password).then((result) => {
                        var userId = result.rows[0].id;
                        //console.log("userid", userid);
                        req.session.userId = userId; //registeredId
                        res.json({
                            success: "success",
                            userId,
                        });
                    }).catch((err) => {
                        console.log("trouble with inserting registerUser data", err); //getting error: relation "usersdata" does not exist
                        res.json({
                            error: "Please try again",
                        });
                    });
                };
            };
        }).catch((err) => {
            console.log("err in checking if email already registered in Registration", err);
            res.json({
                error: "Please try again",
            });
        });
    }).catch((err) => {
        console.log("hash() didn't work", err);
        res.json({
            error: "Please try again",
        });
    });
});
app.get('*', function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
    //res.sendFile(__dirname + '/index.html');
});
/////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////

app.listen(8080, function () {
    console.log("server is listening...");
});
