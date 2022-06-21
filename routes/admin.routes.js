const express = require('express');
const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');

const adminController = require('../controllers/admin.controller');
const authController = require('../controllers/auth.controller');
const contactsController = require('../controllers/contacts.controller');
const outdoorsController = require('../controllers/outdoors.controller');
const profileController = require('../controllers/profile.controller');

router.route('/changeEmail').put([
    body("email", 'O email que inseriu não é válido!').isEmail().notEmpty(),
    body("repeatEmail", 'O email que inseriu não é válido!').isEmail().notEmpty(),
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        authController.verifyToken(req, res);
        if (req.loggedUserId != null) {
            adminController.ChangeCurrentEmail(req, res);
        }
    } else {
        res.status(400).send(errors);
    };
}).get(function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        authController.verifyToken(req, res);
        if (req.loggedUserId != null) {
            adminController.getCurrentEmail(req, res);
        };
    } else {
        res.status(400).send(error);
    };
}).post(function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        adminController.createCurrentEmail(req, res);
    } else {
        res.status(400).send(error);
    };
});

module.exports = router;