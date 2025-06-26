const service = require("../service/service");
const jwt = require("../auth/jwt");
const {getCode} = require("../util/getCode");

const resolvers = {
  Mutation: {
    previousSignUpData: async (_, { email, nickName }) => {
      try {
        if (!verifySignUpDataResponse.success) {
      // armamos los errores solo con los campos necesarios
      const errors = {
        email: verifySignUpDataResponse.message.email ?? null,
        nickName: verifySignUpDataResponse.message.nickName ?? null,
        statusRegistration: verifySignUpDataResponse.message.statusRegistration ?? null,
      };

      // Solo incluimos existNickName si está presente
      if ('existNickName' in verifySignUpDataResponse.message) {
        errors.existNickName = verifySignUpDataResponse.message.existNickName;
      }

      return {
        __typename: "FieldErrorsResponse",
        success: false,
        errors
      };
    }

        

        const previousSignUpDataResponse = await service.previousSignUpData(email, nickName);
        
        if (!previousSignUpDataResponse.success) {
          return {
            __typename:"SuccessResponse",
            success:previousSignUpDataResponse.success,
            message:previousSignUpDataResponse.message
          };
        }
        
        const getCodeResponse = await getCode(email);
        console.log(getCodeResponse)
        return {
          __typename:"TokenResponse",
          success:true,
          token: jwt.tokenTemporal(email,getCodeResponse)};
        
      } catch (error) {
       return {
            __typename:"SuccessResponse",
            success:false,
            message:error
          };
      }
    },
    completedSignUpData: async (_,{newPassword},context)=>{
      try{
        const {informationToken} = context;
        const response = await service.completedSignUpData(newPassword,informationToken.email);
        console.log(response)
        return response;
      }catch(error){
        return {success:false,message:error.message};
      }
    },
    codeValidator: async (_, { receivedCode }, context) => {
      try{
        const { informationToken } = context;
        console.log(informationToken)
    console.log(receivedCode)
      if (!informationToken || typeof informationToken.code === 'undefined') {
        console.log("paso algo")
        return {
          typename:"SuccessResponse",
          success:false,
          message: "codigo invalido." };
      }
      console.log(informationToken.code)
      if (informationToken.code === receivedCode) {
        
        const token = jwt.tokenTemporal(informationToken.email, informationToken.code);
         console.log(token)
        return {
          __typename:"TokenResponse",
          success:true, 
          token: token
        };
      }
      return {
        __typename:"SuccessResponse",
        success:false, 
        message: "Codigo invalido." 
      };

    }catch(error){
      return {
        __typename:"SuccessResponse",
        success:false, 
        message:error 
      }
    }
    },
    signIn: async (_,{nickName,email,password}) =>{
      try{
        console.log(email)
          const response = await service.signIn(nickName,email,password);
          console.log(response)
          if(response.success){ 
              const token = jwt.generateToken(nickName,email)
              return {success:true,token:token};
          }else{
              return {success:false,errors:response.message}
          };

      }catch(error){
          return {success:false, errors:error.message}
      }
    },
    recoverAccount: async (_,{newPassword},context) =>{
    try{
      const {informationToken} = context;
      const response = await service.recoverAccount(informationToken.email,newPassword);
      console.log(response)
      return response;
    }catch(error){
      return {success:false, message:error.message};
    }
    
    },
    realeseAccount: async (_,{email}) =>{
    try{
      const response = await service.realeseAccount(email);
      return response;
    }catch(error){
      return {success:false, message:error.message};
    }
  },
  updateProfile: async(_,{url},context)=>{
    try{
      const {informationToken} = context;

      const response = await service.updateProfile(informationToken.nickName,url);
      console.log(response)
      return response;

    }catch(error){
      return {success:false, message:error.message};
    }

  },
  },
  
  Query:{
    getCode: async (_,{email}) =>{
      const getCodeResponse = await getCode(email);
      console.log(getCodeResponse)
      const response = {success:true,message: jwt.tokenTemporal(email,getCodeResponse)};
      console.log(response)
      return response;
    },
    nicknameSuggestions: async (_, { nickName }) => {
      try {
        const suggestions = new Set();
        const maxAttempts = 30;
        let attempts = 0;
    
        const getRandomSuffix = () => {
          const letters = 'abcdefghijklmnopqrstuvwxyz';
          const numbers = '0123456789';
    
          const randomLetters = Array.from({ length: 2 }, () =>
            letters[Math.floor(Math.random() * letters.length)]
          ).join('');
    
          const randomNumbers = Array.from({ length: 2 }, () =>
            numbers[Math.floor(Math.random() * numbers.length)]
          ).join('');
    
          return randomLetters + randomNumbers;
        };
    
        while (suggestions.size < 3 && attempts < maxAttempts) {
          const suggestion = `${nickName}${getRandomSuffix()}`;
          const exists = await service.userExist(suggestion);
    
          if (!exists.success) {
            suggestions.add(suggestion);
          }
    
          attempts++;
        }
    
        if (suggestions.size === 0) {
          return {
            success: false,
            message: "No nickname suggestions available. Try another base name.",
          };
        }
    
        return {
          success: true,
          suggestions: Array.from(suggestions),
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },getProfile: async (_,{},context) => { 
      try{
        const {informationToken} = context;
        return await service.getProfile(informationToken.nickName);
      }catch(error){
        return {success:false, message:error.message} 
      }
    },
    
  },
  PreviousSignUpDataResponse:{
      __resolveType(obj){
         return obj.__typename;
      }
  },
  codeValidatorResponse:{
    __resolveType(obj){
      return obj.__typename;
    }
  }
};

module.exports = resolvers;
