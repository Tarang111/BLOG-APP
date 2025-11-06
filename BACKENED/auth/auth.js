const { verifyToken } = require("../utilis/jwttokens");

 async function verifyUser(req,res,next)
{
 try {
 let token=req.headers.authorization.split(" ")[1]
    
      
if(!token)
 {
    return res.status(400).json({
        message:"PLEASE SIGN IN",
        success:false
    })
 }

 let user= await verifyToken(token)
 
 if(!user)
 {
      return res.status(400).json({
        message:"PLEASE SIGN IN",
        success:false
    })
 }
  req.user=user.id||null
  
  
     next()
}


catch (error) {
     res.status(500).json({
        message:"SOME ERROR OCCURED",
        successs:false
     })
 } 
    
    
}
module.exports=verifyUser