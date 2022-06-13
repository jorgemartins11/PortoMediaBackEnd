const express = require('express');
const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');

const outdoorController = require('../controllers/outdoors.controller');
const contactsController = require('../controllers/contacts.controller');
const authController = require("../controllers/auth.controller");

router.route('/').get(function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        outdoorController.getVisibleOutdoors(req, res);
    } else {
        res.status(400).send(errors);
    };
});

router.route('/favorite/:outdoorId').post(function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        authController.verifyToken(req, res);
        if (req.loggedUserId != null) {
            outdoorController.addAndRemoveFavorite(req, res);
        };
    } else {
        res.status(400).send(errors);
    };
});

router.route('/:outdoorId').post([
    body("name"),
    body("email", 'O email que inseriu não é válido!').isEmail(),
    body("contact").isNumeric().optional().isLength({
        min: 9,
        max: 9
    }).withMessage("O contacto que inseriu não é válido!"),
    body("company"),
    body("message").optional()
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        authController.verifyToken(req, res);
        if (req.loggedUserId != null) {
            contactsController.makeRequest(req, res);
        };
    } else {
        res.status(400).send(errors);
    };
});

module.exports = router;