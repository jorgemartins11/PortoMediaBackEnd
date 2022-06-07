//* Nodemailer variables
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');

//* SMTP Configuration
const SMTP_CONFIG = require('../config/smtp.config');

//* Database tables
const requestModel = require('../models/request.model');
const Request = requestModel.Request;

const outdoorModel = require('../models/outdoor.model');
const Outdoor = outdoorModel.Outdoor

const userRequestModel = require('../models/user_request.model');
const UserRequest = userRequestModel.User_Request;

//* Email sending variables
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


//* Function for the user to make a "lead"
exports.makeRequest = async (req, res) => {
    Request.create({
        message: req.body.message,
        company: req.body.company,
        outdoorId: req.params.outdoorId
    }).then((result) => {
        UserRequest.create({
            userId: req.loggedUserId,
            requestId: result.id
        });

        transporter.use('compile', hbs({
            viewEngine: {
                extname: '.handlebars',
                layoutsDir: 'views/',
                defaultLayout: 'lead'
            },
            viewPath: "views",
            extName: ".handlebars"
        }));

        //! Mudar variavéis
        const mailSent = transporter.sendMail({
            subject: 'Lead Porto Media: ' + req.body.company,
            from: SMTP_CONFIG.user,
            to: "jorge.daniel11@outlook.com",
            template: "lead",
            context: {
                client_name: req.body.name,
                client_contact: req.body.contact,
                client_email: req.body.email,
                client_message: req.body.message,
                outdoor_id: req.params.outdoorId
            }
        });

        console.log(mailSent);

        res.status(200).json({
            message: "Orçamento pedido com sucesso!"
        })
    }).catch((error) => {
        res.status(400).send(error);
    });
};

//* Function for the user to make contact
exports.makeContact = (req, res) => {
    try {
        transporter.use('compile', hbs({
            viewEngine: {
                extname: '.handlebars',
                layoutsDir: 'views/',
                defaultLayout: 'message'
            },
            viewPath: "views",
            extName: ".handlebars"
        }));

        //! Mudar variavéis
        const mailSent = transporter.sendMail({
            subject: 'Contacto Porto Media: ' + req.body.name,
            from: SMTP_CONFIG.user,
            to: "jorge.daniel11@outlook.com",
            template: "message",
            context: {
                client_name: req.body.name,
                client_contact: req.body.contact,
                client_email: req.body.email,
                client_message: req.body.message
            }
        });

        console.log(mailSent);

        res.status(200).json({
            message: "Mensagem enviada com sucesso!"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    };
};

//* Test function to send an email
exports.sendEmail = async (req, res) => {
    const mailSent = await transporter.sendMail({
        subject: 'Palavra-Passe PortoMedia',
        from: SMTP_CONFIG.user,
        to: 'jorge.daniel11@outlook.com',
        attachments: [{
            filename: 'portomedia_email_banner.jpg',
            path: './assets/portomedia_email_banner.jpg',
            cid: 'banner'
        }],
        template: "email",
        context: {
            password: "12345"
        }
    });

    console.log(mailSent);


    res.status(200).json({
        message: "Email enviado!"
    });
};

exports.try = (req, res) => {
    Request.findAll().then((result) => {
        res.status(200).send(result)
    }).catch((error) => {
        res.status(400).send(error)
    })
}