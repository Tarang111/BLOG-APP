const mongoose=require("mongoose")
require("dotenv").config()
const url=process.env.DB_URL
async function dbconnect()
{
    try{
        await mongoose.connect(url);
        console.log("DB connected")
    }
    catch{
         console.log("DB connection failed")
    }
}
module.exports=dbconnect;