const express=require("express")
const route=express.Router();
const verifyUser = require("../auth/auth");
const {commentBlog, deleteComment, editComment, likeComment, addNestedComment}=require("../controller/commentlogic")
route.post("/blog/comment/:id",verifyUser,commentBlog)
route.delete("/blog/delete/comment/:id",verifyUser,deleteComment)
route.patch("/blog/edit/comment/:id",verifyUser,editComment)
route.post("/blog/like/comment/:id",verifyUser,likeComment)
route.post("/blog/comment/:parentComment/:id",verifyUser,addNestedComment)
module.exports=route