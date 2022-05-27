const dbConfig = require('../config/db.config');

const {
    Sequelize,
    Model,
    DataTypes
} = require('sequelize');
const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect
});

class User_Request extends Model {}

User_Request.init({
    userId: DataTypes.INTEGER,
    requestId: DataTypes.INTEGER
}, {
    sequelize,
    modelName: 'user_request'
})

sequelize.sync().then().catch(error => {
    console.log("ERROR: " + error + " SYNC OUTDOOR REQUEST PLACES MODELS");
})

exports.User_Request = User_Request;