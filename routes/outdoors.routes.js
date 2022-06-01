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
        outdoorController.getOutdoors(req, res);
    } else {
        res.status(400).send(errors);
    };
});

router.route('/:outdoorId').post([
    body("name").escape(),
    body("email").isEmail(),
    body("contact").isNumeric().optional().isLength({min: 9, max:9}),
    body("company").escape(),
    body("message").escape().optional()
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        authController.verifyToken(req, res);
        if (req.loggedUserId != null) {
            if (req.body.function == "budget") {
                contactsController.makeRequest(req, res);
            } else {
                outdoorController.addFavorite(req, res);
            };
        };
    } else {
        res.status(400).send(errors);
    };
}).delete(function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        authController.verifyToken(req, res);
        if (req.loggedUserId != null) {
            outdoorController.removeFavorite(req, res);
        }
    } else {
        res.status(400).send(errors);
    }
})

module.exports = router;