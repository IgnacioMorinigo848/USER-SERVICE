const {verifyToken} = require("./jwt");

const authenticate = (req,res,next)=>{
    if (req.body.query.includes("previousSignUpData")) { 
        return next();
    }
    if (req.body.query.includes("signIn")) { 
        return next();
    }
    if(req.body.query.includes("getCode")){
        return next();
    }
    if(req.body.query.includes("getCodeRecoverAccount")){
        return next();
    }
    if(req.body.query.includes("nicknameSuggestions")){
        return next();
    }
    if(req.body.query.includes("releaseAccount")){
        return next();
    }
    
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({error:"unauthorized access."});
    try{
        const decoded = verifyToken(token);
        req.informationToken = decoded
        next();
        return {__typename:"SuccessResponse",success:false,message:"codigo expirado."}
    }catch(err){
        return res.status(401).json({err:"token overdue."});
    };

};

module.exports = {
    authenticate
};