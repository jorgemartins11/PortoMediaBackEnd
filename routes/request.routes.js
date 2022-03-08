const express = require('express');
const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');

const contactsController = require('../controllers/contacts.controller');

router.route('/').post([
    body('name').escape().notEmpty(),
    body('email').isEmail().notEmpty(),
    body('phone_number').isNumeric().notEmpty(),
    body('subject').escape(),
    body('message').escape()
], function(req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        contactsController.makeRequest(req, res);
    } else {
        res.status(400).send(errors);
    }
})

module.exports = router;