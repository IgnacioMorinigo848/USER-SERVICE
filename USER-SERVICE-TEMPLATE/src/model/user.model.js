const { sequelize } = require("../config/mysql.connection");
const { Sequelize, DataTypes } = require('sequelize');

const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    profileImage:{
        type:DataTypes.STRING(300),
        unique:true,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    nickName:{
        type: DataTypes.STRING(25),
        allowNull:false,
        unique:true,
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    statusRegistration: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false,
    },
}, {
    tableName: "user",
    timestamps: false  
});

sequelize.sync()
.then(() =>{
    console.log("table synchronized successfully.");
})
.catch((error) => {
    console.error('table not synchronized.', error);
  });

module.exports = User;
