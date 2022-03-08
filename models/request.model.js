const dbConfig = require('../config/db.config');

const { Sequelize, Model, DataTypes } = require('sequelize'); 
const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST, 
    dialect: dbConfig.dialect
})

class Request extends Model {}

Request.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.INTEGER,
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    monthly_price: DataTypes.DOUBLE
}, { sequelize, modelName: 'request'})

sequelize.sync().then().catch(error => {
    console.log("ERROR: " + error + " SYNC REQUEST MODELS"); 
})

exports.Request = Request;