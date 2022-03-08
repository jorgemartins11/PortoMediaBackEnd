const requestModel = require('../models/request.model');
const Request = requestModel.Request;

const outdoorModel = require('../models/outdoor.model');
const Outdoor = outdoorModel.Outdoor;

const outdoor_requestModel = require('../models/outdoor_request.model');
const Outdoor_Request = outdoor_requestModel.Outdoor_Request;

const makeRequest = (req, res) => {
    Request.create({
        name: req.body.name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        subject: req.body.subject,
        message: req.body.message
    }).then((result) => {
        res.status(200).json(result);
    }).catch((error) => {
        res.status(400).send(error);
    });
};

exports.makeRequest = makeRequest;