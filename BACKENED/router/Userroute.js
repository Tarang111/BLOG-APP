const express=require("express");
const {createUser,updateUser,getAllUser,loginUser,deleteUser,getUserbyId, verifyUserviatoken, googleAuthentication, follow} = require("../controller/userlogic");
const verifyUser = require("../auth/auth");
const route=express.Router();
const upload = require("../utilis/multer");
route.post("/user/signup",createUser );
route.get("/user",getAllUser)
route.get("/user/:id",getUserbyId) 
route.delete("/user/:id",deleteUser)
route.post("/user/signin",loginUser)
route.get("/user/verifyemail/:token",verifyUserviatoken)
route.post("/google-auth",googleAuthentication)
route.post("/follow/:id",verifyUser,follow)
route.patch("/editprofile/:id",verifyUser, upload.single("profilePic"),updateUser)
module.exports=route
