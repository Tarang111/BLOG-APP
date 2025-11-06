const express=require("express");
const app=express();
const Userroute=require("./router/Userroute")
const Blogroute=require("./router/Blogroute")
const commentroute=require("./router/commentRoute")
const cors=require("cors");
const dbconnect = require("./config/Dbconnect");
const cloudinaryConfig = require("./config/cloudinaryConnect");
require("dotenv").config()

const port=process.env.PORT
app.use(express.json())
app.use(cors({origin:"http://localhost:5173",credentials: true,}))
app.get("/",(req,res)=>{
    res.send("hello ji")
})
app.use("/api/v1", Userroute);
app.use("/api/v1",Blogroute)
app.use("/api/v1",commentroute)
app.listen(port,()=>{
    console.log("server started");
    dbconnect();
    cloudinaryConfig();
})
