//* Encrypting variables
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");

//* Nodemailer variables
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');

//* SMTP Configuration
const SMTP_CONFIG = require('../config/smtp.config');

//* Database's User table
const userModel = require('../models/user.model');
const User = userModel.User;

//* Log In Function
exports.logIn = async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) return res.status(404).json({
            message: "User Not found."
        });
        const passwordIsValid = await bcrypt.compareSync(
            req.body.password, user.password.toString()
        );

        if (
            !passwordIsValid
        ) {
            return res.status(401).json({
                accessToken: null,
                message: "Passwords don't match!"
            });
        }

        const token = jwt.sign({
            id: user.id
        }, config.secret, {
            expiresIn: 86400
        });

        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: token
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    };
};

//* Register Funcion
exports.register = async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (user)
            return res.status(400).json({
                message: "Failed! Email is already in use!"
            });
        if (req.body.email != req.body.repeatEmail) {
            return res.status(400).json({
                message: "Failed! Email's don't match!"
            });
        }
        let password = generateRandomPassword()
        user = await User.create({
            // name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(password, 8),
            user_type: 'Cliente'
        });

        const transporter = await nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: true,
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        transporter.use('compile', hbs({
            viewEngine: {
                extname: '.handlebars',
                layoutsDir: 'views/',
                defaultLayout: 'email'
            },
            viewPath: "views",
            extName: ".handlebars"
        }));

        const mailSent = transporter.sendMail({
            subject: 'Palavra-Passe PortoMedia',
            from: SMTP_CONFIG.user,
            to: req.body.email,
            attachments: [{
                filename: 'portomedia_email_banner.jpg',
                path: './assets/portomedia_email_banner.jpg',
                cid: 'banner'
            }],
            template: "email",
            context: {
                password: password
            }
        });

        console.log(mailSent);

        return res.json({
            message: "User was registered successfully! " + password
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    };
};

//* Update Password Function
exports.updatePassword = (req, res) => {
    if (req.body.password == req.body.repeatPassword) {
        User.update({
            password: bcrypt.hashSync(req.body.password, 8),
        }, {
            where: {
                id: req.loggedUserId
            }
        }).then((result) => {
            res.status(200).json({
                message: "Palavra-passe atualizada com sucesso!"
            });
        }).catch((error) => {
            res.status(400).send(error);
        })
    } else {
        res.status(401).json({
            message: "Palavras-passe não coincidem!"
        })
    }
};

//* Recover Password Function
exports.recoverPassword = async (req, res) => {
    let user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!user) {
        res.status(400).json({
            message: "O email que inseriu não está registado!"
        });
    } else {
        let password = generateRandomPassword();

        await User.update({
            password: password
        }, {
            where: {
                id: req.loggedUserId
            }
        });

        //? Email
        const transporter = nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: true,
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        transporter.use('compile', hbs({
            viewEngine: {
                extname: '.handlebars',
                layoutsDir: 'views/',
                defaultLayout: 'recoverpassword_email'
            },
            viewPath: "views",
            extName: ".handlebars"
        }));

        const mailSent = await transporter.sendMail({
            subject: 'Recuperar Palavra-Passe PortoMedia',
            from: SMTP_CONFIG.user,
            to: req.body.email,
            attachments: [{
                filename: 'portomedia_email_banner.jpg',
                path: './assets/portomedia_email_banner.jpg',
                cid: 'banner'
            }],
            template: "recoverpassword_email",
            context: {
                password: password
            }
        });

        console.log(mailSent);
        //? Email

        res.status(200).json({
            message: "Foi-lhe enviado um email com uma nova palavra-passe!"
        });
    };
};

//* Function to verify the logged User
exports.verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.loggedUserId = decoded.id;
        return req.loggedUserId;
    });
};

//* Function to get User's type
exports.isAdmin = async (req, res, next) => {
    let user = await Users.findByPk(req.loggedUserId);
    console.log(user.user_type_id)
    if (user.user_type_id === 'Admin') {
        next();
        return;
    }
    return res.status(403).send({
        message: "Require Admin Role!"
    })
};

//* Function to generate a random password
function generateRandomPassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.:,;-_+*?!#$%&/()=";

    let password = "";

    for (let index = 0; index < 12; index++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1)
    }

    return password;
}