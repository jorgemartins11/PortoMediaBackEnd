const nodemailer = require("nodemailer");
const SMTP_CONFIG = require('../config/smtp.config');

const requestModel = require('../models/request.model');
const Request = requestModel.Request;

const outdoorModel = require('../models/outdoor.model');
const Outdoor = outdoorModel.Outdoor;

const outdoor_requestModel = require('../models/outdoor_request.model');
const Outdoor_Request = outdoor_requestModel.Outdoor_Request;

exports.makeRequest = (req, res) => {
    Request.create({
        name: req.body.name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        subject: req.body.subject,
        message: req.body.message
    }).then((result) => {
        res.status(200).json(result);
    }).catch((error) => {
        res.status(400).send(error);
    });
};

exports.makeContact = (req, res) => {

}

exports.sendEmail = async (req, res) => {
    const transporter = nodemailer.createTransport({
        host: SMTP_CONFIG.host,
        port: SMTP_CONFIG.port,
        secure: false,
        auth: {
            user: SMTP_CONFIG.user,
            pass: SMTP_CONFIG.pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailSent = await transporter.sendMail({
        text: 'Hello World!',
        subject: 'Hello World!',
        from: 'Jorge Martins <' + SMTP_CONFIG.user + '>',
        to: 'jorge.daniel11@outlook.com'
    })

    console.log(mailSent);

    res.status(200).json({message: "Email enviado!"})
}