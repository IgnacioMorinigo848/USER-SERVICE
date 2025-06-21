const jwt = require("jsonwebtoken");
require("dotenv").config()

const generateToken = (nickName,email) =>{
    return jwt.sign({nickName:nickName,email: email},process.env.JWT_SECRET);
};

const tokenTemporal = (email, code) => {
    return jwt.sign({ email:email, code:code }, process.env.JWT_SECRET, { expiresIn: "10m" });
  };

const verifyToken = (token) =>{
    return jwt.verify(token,process.env.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken,
    tokenTemporal,
};