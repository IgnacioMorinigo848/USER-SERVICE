const { where } = require("sequelize");
const User = require("../model/user.model");
const {hashPassword,comparePassword} = require("../util/hash"); 

const verifySignUpData = async (email, nickName) => {
  try {
    const [emailResponse, nickNameResponse] = await Promise.all([
      User.findOne({
        attributes: ["email", "statusRegistration"],
        where: { email }
      }),
      User.findOne({
        attributes: ["nickName"],
        where: { nickName }
      }),
    ]);

    let errors = {};

    if (emailResponse && emailResponse.statusRegistration) {
      errors.email = "el email ya existe.";
    }

    if (nickNameResponse) {
      errors.nickName = "el nombre de usuario ya existe.";
    }

    if (emailResponse && !emailResponse.statusRegistration) {
      errors.statusRegistration = "se debe pedir la liberación del email.";
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, message: errors };
    }

    return { success: true, message: "datos comprobados exitosamente." };

  } catch (error) {
    return { success: false, message: error.message };
  }
};


const previousSignUpData = async (email, nickName) => {
  try {
    let password = hashPassword(Math.floor(100000000000 + Math.random() * 900000000000));
    password = (await password).toString()
    const response = await User.create({ email, nickName,password});
    return response ? { success: true, message:"el registro previo se realizo exitosamente."}:{success:false, message:"el registro previo no se pudo realizar exitosamente."}
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const completedSignUpData= async (newPassword, userEmail) =>{
  try{
    const newHashedPassword = await hashPassword(newPassword);
    const operation = await Promise.all([
      User.update({password:newHashedPassword},{where:{email:userEmail}}),
      User.update({statusRegistration:true},{where:{email:userEmail}})
    ]);
    return operation ? {success:true, message:"el usuario fue registrado correctamente."}:{success:false, message:"el usuario no pudo ser registrado."};

  } catch(error){
    return {success:false,message:error.message};

  }

};

const signIn = async (email,password) => {
  try {
    const errors = {};
    
    const user = await User.findOne({
      attributes: ["nickName","email", "password"],
      where: { email }
    });

    if (user) {
      console.log(user.email,email)
      if(user && user.email == email){
        const isValid = await comparePassword(password, user.password);
        return isValid ? { success: true, message: user} : { success: false, message: { password: "contraseña invalida." } };
      }else{
        errors.email = "el email es invalido.";
        return { success: false, message: errors };
      };
    } 
  } catch (error) {
    return { success: false, message:error.message };
  }
};

const recoverAccount = async (email,password) =>{
  try{
    const status = await User.findOne({
      attributes:["statusRegistration"],
      where:{email:email}
    });
    if (!status)
      return {success:false, message:"no se completo el registro o no existe el email."};
    const newPassword = await hashPassword(password);
   
    await User.update({password:newPassword},{where:{email:email}})
    return {success:true,message:"la contraseña se actualizo correctamente.."};
  }catch(error){
    return {success:false, message:error.message};
  }
};

const userExist = async (suggestion) =>{
 try{
  const exists = await User.findOne({where:{nickName: suggestion} });
  return exists ? {success:true, message:"el nombre de usuario ya existe."}:{success:false, message:"el nombre de usuario no existe."}
 }catch(error){
  return {success:true, message:error.message};
 }
};

const realeseAccount = async (email) =>{
  try{
    const response = await User.findOne({
      attributes:["statusRegistration"],
      where:{email:email}
    });
    if(!response)
      return {success:false, message:"el email no existe."};
    if(response && response.statusRegistration)
      return {success:false, message:"no se pudo recuperar el email porque el estado de registro esta completo."};
    if(response && !response.statusRegistration){
      const deleteResponse = await User.destroy(
        {
        where:{email}
        });
        return deleteResponse ? {success:false, message:"el email se recupero exitosamente."}:{success:false, message:"el email no pudo ser recuperado correctamente."};
      } 
      return {success:false, message:"el email no pudo ser recuperado correctamente."};

  }catch(error){
    return {success:false, message:error.message};
  }
};

const updateProfile = async (nickName, newProfileImage) => {
  try {
    // 1. Obtener la URL anterior
    const userRecord = await User.findOne({
      attributes: ['profileImage'],
      where: { nickName },
    });

    const previousUrl = userRecord?.profileImage || null;

    // 2. Actualizar la nueva imagen
    const [updatedRows] = await User.update(
      { profileImage: newProfileImage },
      { where: { nickName } }
    );

    if (updatedRows > 0) {
      return {
        success: true,
        message: 'Imagen actualizada exitosamente.',
        url: previousUrl, 
      };
    } else {
      return {
        success: false,
        message: 'No se pudo actualizar la imagen (usuario no encontrado o sin cambios).',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const getProfile = async (nickName) => {
  try {
    const profile = await User.findOne({
      attributes: ['nickName', 'email', 'profileImage'],
      where: { nickName },
    });

    console.log(profile)
    return profile
      ? { success: true, profile, message: 'Perfil obtenido exitosamente.' }
      : { success: false,message: 'No se pudo obtener el perfil.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  verifySignUpData,
  previousSignUpData,
  completedSignUpData,
  signIn,
  recoverAccount,
  userExist,
  realeseAccount,
  updateProfile,
  getProfile
};
