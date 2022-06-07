const express = require('express');
const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');

const contactsController = require('../controllers/contacts.controller');

router.route('/').post([
    body("name").notEmpty(),
    body("email", "O email que inseriu não é valido!").isEmail().notEmpty(),
    body("contact").isNumeric().optional().isLength({
        min: 9,
        max: 9
    }).withMessage("O contacto que inseriu não é válido!"),
    body("message").notEmpty()
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        contactsController.makeContact(req, res);
    } else {
        res.status(400).send(errors);
    }
})

module.exports = router;