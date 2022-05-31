const dbConfig = require('../config/db.config');

const { Sequelize, Model, DataTypes } = require('sequelize'); 
const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST, 
    dialect: dbConfig.dialect,
    retry: {
        match: [
            /ETIMETOUT/,
            /EHOSTUNREACH/,
            /ECONNRESET/,
            /ECONNREFUSED/,
            /ETIMEDOUT/,
            /ESOCKETTIMEDOUT/,
            /EHOSTUNREACH/,
            /EPIPE/,
            /EAI_AGAIN/,
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeHostNotReachableError/,
            /SequelizeInvalidConnectionError/,
            /SequelizeConnectionTimedOutError/
        ],
        max: 5
    }
});

class Favorite extends Model {}

Favorite.init({
    userId: DataTypes.INTEGER,
    outdoorId: DataTypes.INTEGER
}, { sequelize, modelName: 'favorite'})

sequelize.sync().then().catch(error => {
    console.log("ERROR: " + error + " SYNC FAVORITES MODELS"); 
})

exports.Favorite = Favorite;