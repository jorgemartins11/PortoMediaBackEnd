const dbConfig = require('../config/db.config');

const { Sequelize, Model, DataTypes } = require('sequelize'); 
const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST, 
    dialect: dbConfig.dialect
})

const OutdoorModel = require('./outdoor.model');
const Outdoor = OutdoorModel.Outdoor;

class Request extends Model {}

Request.init({
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    monthly_price: DataTypes.DOUBLE
}, { sequelize, modelName: 'request'});

Outdoor.hasMany(Request, {as: "request"});
Request.belongsTo(Outdoor, {
    foreignKey: "outdoorId",
    as: "outdoor"
})

sequelize.sync().then().catch(error => {
    console.log("ERROR: " + error + " SYNC REQUEST MODELS"); 
})

exports.Request = Request;