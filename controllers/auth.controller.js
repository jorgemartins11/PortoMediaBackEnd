const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");

const nodemailer = require("nodemailer");
const SMTP_CONFIG = require('../config/smtp.config');

const userModel = require('../models/user.model');
const User = userModel.User;

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

}

exports.register = async (req, res) => {
    console.log("hello")
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
        let password = generateRandomPassword()
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(password, 8),
            user_type: 'Cliente'
        });

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

        const mailSent = await transporter.sendMail({
            subject: 'Password',
            from: SMTP_CONFIG.user,
            to: 'jorge.daniel11@outlook.com',
            html: `
                <p>${password}</p>
                <img src="cid:banner">
            `,
            attachments: [{
                filename: 'portomedia_email_banner.jpg',
                path: '../PortoMediaBackEnd/assets/portomedia_email_banner.jpg',
                cid: 'banner' //same cid value as in the html img src
            }]
        })

        console.log(mailSent);

        return res.json({
            message: "User was registered successfully!" + password
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    };
};

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

function generateRandomPassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

    let password = "";

    for (let index = 0; index < 12; index++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1)
    }

    return password;
}

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
}

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