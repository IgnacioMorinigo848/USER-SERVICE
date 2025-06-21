const { Sequelize } = require("sequelize");
require("dotenv").config();

console.log('HOST:', process.env.HOST);
console.log('DB_PORT:', process.env.DB_PORT);

const sequelize = new Sequelize(
  process.env.DATA_BASE_NAME,       // Nombre de la base
  process.env.USER,                 // Usuario
  process.env.DATA_BASE_PASSWORD,   // Contraseña
  {
    host: process.env.HOST,         // Host de Railway
    port: process.env.DB_PORT || 3306, // Puerto (usualmente 3306 para MySQL)
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
  sequelize,
};
