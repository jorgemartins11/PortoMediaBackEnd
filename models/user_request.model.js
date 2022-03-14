const dbConfig = require('../config/db.config');

const { Sequelize, Model, DataTypes } = require('sequelize'); 
const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST, 
    dialect: dbConfig.dialect
})


const userModel = require('./user.model');
const User = userModel.User;
const requestModel = require('./request.model');
const Request = requestModel.Request;

class User_Request extends Model {}

User_Request.init({}, { sequelize, modelName: 'user_request'})

User_Request.belongsTo(User);
User_Request.belongsTo(Request);

sequelize.sync().then().catch(error => {
    console.log("ERROR: " + error + " SYNC OUTDOOR REQUEST PLACES MODELS"); 
})

exports.User_Request = User_Request;