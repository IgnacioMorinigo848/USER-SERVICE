const sendEmail = require("./transportadorSMTP");

const getCode = async (email) => {
  try{
    const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const parseCode = code.toString();
    const response = await sendEmail(email,parseCode);
    return parseCode
  }catch(error){
    return {success:false, message:error.message}
  }
    
  }

  module.exports = {getCode};