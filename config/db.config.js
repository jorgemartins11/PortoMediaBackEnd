/**
 * Get all the data that is related to the database
 * It contains the host server and the credentials to get into the database
 */
 const config = {
    HOST: "www.smartcitysensor.pt",
    USER: "smartcit_portomedia",
    PASSWORD: process.env.DB_PASS,
    DB: "smartcit_PortoMedia",
    dialect: "mysql"
    // pool: {
    //     max: 5,
    //     min: 0,
    //     acquire: 30000,
    //     idle: 10000
    // }
};

// Export database config
module.exports = config;