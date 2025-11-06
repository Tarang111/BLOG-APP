const jwt=require("jsonwebtoken")
require("dotenv").config()
async function generateJwt(payload)
{
         const token = await jwt.sign(payload,process.env.TOKEN_SECRET_KEY)
         return token;
}
async function verifyToken(token)
{
   try{
        let isvalid=await jwt.verify(token,process.env.TOKEN_SECRET_KEY)
        return isvalid;
        
   }
   catch 
   {
    return false;
   }
}

module.exports={generateJwt,verifyToken}