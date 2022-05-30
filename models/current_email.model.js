const dbConfig = require('../config/db.config');

const { Sequelize, Model, DataTypes } = require('sequelize'); 
const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST, 
    dialect: dbConfig.dialect
});

class CurrentEmail extends Model {}

CurrentEmail.init({
    email: DataTypes.STRING
}, { sequelize, modelName: 'current_email'})

sequelize.sync().then().catch(error => {
    console.log("ERROR: " + error + " SYNC CURRENT EMAIL MODEL"); 
})

exports.CurrentEmail = CurrentEmail;