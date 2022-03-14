const outdoorModel = require('../models/outdoor.model');
const Outdoor = outdoorModel.Outdoor;

exports.getOutdoors = (req, res) => {
    Outdoor.findAll().then((result) => {
        res.status(200).json(result);
    }).catch((errors) => {
        res.status(400).send(errors);
    })
}