const dbConfig = require('../config/db.config');

const { Sequelize, Model, DataTypes } = require('sequelize'); 
const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST, 
    dialect: dbConfig.dialect
})

class Outdoor extends Model {}

Outdoor.init({
    photo: DataTypes.BLOB,
    adress: DataTypes.STRING,
    available: DataTypes.BOOLEAN
}, { sequelize, modelName: 'outdoor'})

sequelize.sync().then().catch(error => {
    console.log("ERROR: " + error + " SYNC OUTDOOR MODELS"); 
})

exports.Outdoor = Outdoor;