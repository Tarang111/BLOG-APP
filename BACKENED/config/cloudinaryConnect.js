const cloudinary=require("cloudinary").v2
require("dotenv").config()
async function cloudinaryConfig()
{
    try{
         await cloudinary.config({ 
         cloud_name:process.env.CLOUD_NAME , 
         api_key: process.env.CLOUD_API_KEY, 
         api_secret: process.env.CLOUD_API_SECRETKEY
         });
         console.log("cloudinary configuration successfull")
    }
    catch(err)
    {
        console.log(err.message)
    }

}
module.exports=cloudinaryConfig