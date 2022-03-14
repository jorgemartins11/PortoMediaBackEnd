const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");

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
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(generateRandomPassword(), 8),
        });

        return res.json({
            message: "User was registered successfully!"
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
        next();
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
            password: req.body.password
        }, {
            where: {
                id: req.loggedUserId
            }
        }).then((result) => {
            res.status(200).json({message: "Palavra-passe atualizada com sucesso!"});
        }).catch((error) => {
            res.status(400).send(error);
        })
    } else {
        res.status(401).json({message: "Palavras-passe não coincidem!"})
    }
}