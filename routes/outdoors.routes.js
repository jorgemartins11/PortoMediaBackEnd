const express = require('express');
const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');

const outdoorController = require('../controllers/outdoors.controller');

router.route('/').get(function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        outdoorController.getOutdoors(req, res);
    } else {
        res.status(400).send(errors);
    }
})

module.exports = router;