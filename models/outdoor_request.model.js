const dbConfig = require('../config/db.config');

const { Sequelize, Model, DataTypes } = require('sequelize'); 
const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST, 
    dialect: dbConfig.dialect
})


const outdoorModel = require('./outdoor.model');
const Outdoor = outdoorModel.Outdoor;
const requestModel = require('./request.model');
const Request = requestModel.Request;

class Outdoor_Request extends Model {}

Outdoor_Request.init({}, { sequelize, modelName: 'outdoor_request'})

Outdoor_Request.belongsTo(Outdoor);
Outdoor_Request.belongsTo(Request);

sequelize.sync().then().catch(error => {
    console.log("ERROR: " + error + " SYNC OUTDOOR REQUEST PLACES MODELS"); 
})

exports.Outdoor_Request = Outdoor_Request;