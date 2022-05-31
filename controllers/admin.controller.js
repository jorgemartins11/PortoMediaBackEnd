const currentEmailModel = require('../models/current_email.model');
const CurrentEmail = currentEmailModel.CurrentEmail;

const outdoorModel = require('../models/outdoor.model');
const Outdoor = outdoorModel.Outdoor;

/**
 *! Available & Visible  
 *? 1 - True
 *? 0 - False
 */

exports.ChangeCurrentEmail = (req, res) => {
    CurrentEmail.update({
        email: req.body.email
    }, {
        where: {
            id: 1
        }
    }).then((result) => {
        res.status(200).json({
            message: "Email mudado para: " + req.body.email
        });
    }).catch((error) => {
        res.status(400).send(error);
    });
};

exports.getOutdoors = (req, res) => {
    Outdoor.findAll().then((result) => {
        res.status(200).json(result);
    }).catch((errors) => {
        res.status(400).send(errors);
    })
};

exports.changeOutdoorVisibility = (req, res, visibility) => {
    Outdoor.update({
        visible: parseInt(visibility)
    }, {
        where: {
            id: req.body.id
        }
    }).then((result) => {
        res.status(200).json({
            message: "Outdoor atualizado com sucesso!"
        });
    }).catch((error) => {
        res.status(400).send(error);
    });
};

exports.AddAcceptedRequest = (req, res) => {
    
};