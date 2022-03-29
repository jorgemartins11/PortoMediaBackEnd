const dbConfig = require('../config/db.config');

const { Sequelize, Model, DataTypes } = require('sequelize'); 
const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST, 
    dialect: dbConfig.dialect
})


const userModel = require('./user.model');
const User = userModel.User;
const outdoorModel = require('./outdoor.model');
const Outdoor = outdoorModel.Outdoor;

class Favorite extends Model {}

Favorite.init({}, { sequelize, modelName: 'favorite'})

Favorite.belongsTo(User);
Favorite.belongsTo(Outdoor);

sequelize.sync().then().catch(error => {
    console.log("ERROR: " + error + " SYNC OUTDOOR REQUEST PLACES MODELS"); 
})

exports.User_Request = Favorite;