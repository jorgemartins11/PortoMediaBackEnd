const requestModel = require('../models/request.model');
const Request = requestModel.Request;

const outdoorModel = require('../models/outdoor.model');
const Outdoor = outdoorModel.Outdoor;

const outdoor_requestModel = require('../models/outdoor_request.model');
const Outdoor_Request = outdoor_requestModel.Outdoor_Request;

const makeRequest = (req, res) => {
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

const makeContact = (req, res) => {

}

const sendEmail = (req, res) => {
    "use strict";
    const nodemailer = require("nodemailer");

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: "jorge.daniel11@outlook.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);

    res.status(200).json({message: "Email enviado!"})

}

exports.makeRequest = makeRequest;
exports.makeContact = makeContact;
exports.sendEmail = sendEmail;