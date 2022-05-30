const outdoorModel = require('../models/outdoor.model');
const Outdoor = outdoorModel.Outdoor;

const favoritesModel = require('../models/favorites.model');
const Favorite = favoritesModel.Favorite;

/**
 *! Available & Visible  
 *? 1 - True
 *? 0 - False
 */

exports.getVisibleOutdoors = (req, res) => {
    Outdoor.findAll({
        where: {
            visible: 1
        }
    }).then((result) => {
        res.status(200).json(result);
    }).catch((error) => {
        res.status(400).send(error);
    })
};

exports.createOutdoor = (req, res) => {
    Outdoor.create({
        photoSrc: req.body.photoSrc,
        adress: req.body.adress,
        available: req.body.available,
        visible: req.body.visible
    }).then((result) => {
        res.status(200).json(result);
    }).catch((error) => {
        res.status(400).send(error);
    });
};

exports.addFavorite = (req, res) => {
    Favorite.create({
        userId: req.loggedUserId,
        outdoorId: req.params.outdoorId
    }).then((result) => {
        res.status(200).json(result);
    }).catch((error) => {
        res.status(400).send(error);
    });
};

exports.removeFavorite = (req, res) => {
    Favorite.destroy({
        where: {
            userId: req.loggedUserId,
            outdoorId: req.params.outdoorId
        }
    }).then((result) => {
        res.status(200).json({
            message: "Outdoor removido dos favoritos!"
        });
    }).catch((error) => {
        res.status(400).send(error);
    })
};