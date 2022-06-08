const dbConfig = require('../config/db.config');

const {
    Sequelize,
    Model,
    DataTypes
} = require('sequelize');
const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    define: {
        timestamps: false
    },
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
})

class Outdoor extends Model {}

Outdoor.init({
    name: DataTypes.STRING,
    photoSrc: DataTypes.STRING,
    adress: DataTypes.STRING,
    available: DataTypes.INTEGER,
    visible: DataTypes.INTEGER
}, {
    sequelize,
    modelName: 'outdoor'
})

sequelize.sync().then().catch(error => {
    console.log("ERROR: " + error + " SYNC OUTDOOR MODELS");
})

exports.Outdoor = Outdoor;