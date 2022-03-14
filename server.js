const express = require('express');
require('dotenv').config();
const app = express(); 
const port = process.env.PORT || 3000;
const cors = require('cors');
const {
    body,
    validationResult
} = require('express-validator');

app.use(express.json());
app.use(cors());

const companyRouter = require('./routes/company.routes');
const contactsRouter = require('./routes/contacts.routes');
const outdoorsRouter = require('./routes/outdoors.routes');
const requestRouter = require('./routes/request.routes');

const outdoorModel = require('./models/outdoor.model');
const requestModel = require('./models/request.model');
const outdoor_requestModel = require('./models/outdoor_request.model');
const userModel = require('./models/user.model');
const user_resquestModel = require('./models/user_request.model');

app.get('/', function (req, res) {
    res.status(200).json({
        message: 'home'
    });
});

const authController = require('./controllers/auth.controller');
const contactsController = require('./controllers/contacts.controller');

app.route('/login').post([
    body('email').notEmpty().isEmail(),
    body('password').notEmpty().escape()
], function(req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        authController.logIn(req, res);
    } else {
        res.status(400).send(errors)
    }
})

app.route('/register').post([
    body('name').notEmpty().escape(),
    body('email').notEmpty().isEmail(),
    body('password').notEmpty().escape(),
    body('phone_number').notEmpty().isNumeric()
], function(req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        authController.register(req, res);
    } else {
        res.status(400).send(errors);
    }
})

app.route('/email').get(function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        contactsController.sendEmail(req, res);
    }
})

// app.use('/quemsomos', companyRouter);
// app.use('/contactos', contactsRouter);
// app.use('/outdoors', outdoorsRouter);
app.use('/fazer-pedido', requestRouter);

app.listen(port, () => {
    console.log('Server Running at http://localhost:' + port);
});

