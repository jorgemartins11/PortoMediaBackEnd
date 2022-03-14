const express = require('express');
const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');

const contactsController = require('../controllers/contacts.controller');

router.route('/').get(function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        contactsController.makeContact(req, res);
    } else {
        res.status(400).send(errors);
    }
})

module.exports = router;