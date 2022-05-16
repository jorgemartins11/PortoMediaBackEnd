const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');

const SMTP_CONFIG = require('../config/smtp.config');

const requestModel = require('../models/request.model');
const Request = requestModel.Request;

const outdoorModel = require('../models/outdoor.model');
const Outdoor = outdoorModel.Outdoor;

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
        secure: true,
        auth: {
            user: SMTP_CONFIG.user,
            pass: SMTP_CONFIG.pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    //! Verificar viewPath (não está a ler corretamente o diretorio)
    transporter.use('compile', hbs({
        viewEngine: {
            extname: '.handlebars',
            layoutsDir: 'views/',
            defaultLayout: 'email'
        },
        viewPath: "views",
        extName: ".handlebars"
    }))

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
            password: "12345",
            bannerSrc: "../assets/portomedia_email_banner.jpg"
        }
    })

    console.log(mailSent);


    res.status(200).json({
        message: "Email enviado!"
    })
}