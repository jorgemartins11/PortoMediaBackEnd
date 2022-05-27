const dbConfig = require('../config/db.config');

const { Sequelize, Model, DataTypes } = require('sequelize'); 
const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST, 
    dialect: dbConfig.dialect
});

class Favorite extends Model {}

Favorite.init({
    userId: DataTypes.INTEGER,
    outdoorId: DataTypes.INTEGER
}, { sequelize, modelName: 'favorite'})

sequelize.sync().then().catch(error => {
    console.log("ERROR: " + error + " SYNC OUTDOOR REQUEST PLACES MODELS"); 
})

exports.Favorite = Favorite;