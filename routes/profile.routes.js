const express = require('express');
const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');

const profileController = require('../controllers/profile.controller');
const authController = require('../controllers/auth.controller');

router.route('/').get(function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        authController.verifyToken(req, res);
        if (req.loggedUserId != null) {
            profileController.getUserFavoritesAndOutdoors(req, res);
        };
    } else {
        res.status(400).send(errors);
    };
}).put([
    body("name").optional().escape(),
    body("email").optional().isEmail(),
    body("password").optional().escape(),
    body("phone_number").optional().isNumeric(),
    body("company").optional().escape()
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        authController.verifyToken(req, res);
        if (req.loggedUserId != null) {
            profileController.editProfile(req, res);
        };
    } else {
        res.status(400).send(errors);
    };
})

module.exports = router;