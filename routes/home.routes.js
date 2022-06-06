const express = require('express');
const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');

const contactsController = require('../controllers/contacts.controller');
const authController = require('../controllers/auth.controller');

router.route('/login').post([
    body('email').notEmpty().isEmail(),
    body('password').notEmpty().escape()
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        authController.logIn(req, res);
    } else {
        res.status(400).send(errors)
    }
})

router.route('/register').post([
    body('email').notEmpty().isEmail(),
    body('repeatEmail').notEmpty().isEmail()
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        authController.register(req, res);
    } else {
        res.status(400).send(errors);
    }
})

router.route('/trocar-password').put([
    body('password').notEmpty().escape(),
    body('repeatPassword').notEmpty().escape()
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        authController.verifyToken(req, res);
        if (req.loggedUserId != null) {
            authController.updatePassword(req, res);
        }
    } else {
        res.status(400).send(errors);
    }
})

router.route('/email').get(function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        contactsController.sendEmail(req, res);
    }
})

router.route('/try').get(function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        contactsController.try(req, res);
    }
})

module.exports = router;