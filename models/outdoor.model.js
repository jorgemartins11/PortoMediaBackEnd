const dbConfig = require('../config/db.config');

const { Sequelize, Model, DataTypes } = require('sequelize'); 
const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST, 
    dialect: dbConfig.dialect
})

class Outdoor extends Model {}

Outdoor.init({
    photoSrc: DataTypes.STRING,
    adress: DataTypes.STRING,
    available: DataTypes.INTEGER,
    visible: DataTypes.INTEGER
}, { sequelize, modelName: 'outdoor'})

sequelize.sync().then().catch(error => {
    console.log("ERROR: " + error + " SYNC OUTDOOR MODELS"); 
})

exports.Outdoor = Outdoor;