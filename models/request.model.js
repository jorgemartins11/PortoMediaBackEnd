const dbConfig = require('../config/db.config');

const {
    Sequelize,
    Model,
    DataTypes
} = require('sequelize');
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

class Request extends Model {}

Request.init({
    company: DataTypes.STRING,
    userEmail: DataTypes.STRING,
    outdoorNumber: DataTypes.INTEGER,
    monthly_price: DataTypes.DOUBLE,
    begin_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    status: DataTypes.STRING
}, {
    sequelize,
    modelName: 'request'
});

sequelize.sync().then().catch(error => {
    console.log("ERROR: " + error + " SYNC REQUEST MODELS");
});

exports.Request = Request;