const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DATA_BASE_NAME,
    process.env.USER,
    process.env.DATA_BASE_PASSWORD,
    {
        host: process.env.HOST,
        dialect: "mysql",
        logging: false,
    }
);

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Successfully connected to MySQL.");
    } catch (error) {
        console.error("Error: Not connected to MySQL", error);
    }
};

module.exports = {
    connection,
    sequelize
};
