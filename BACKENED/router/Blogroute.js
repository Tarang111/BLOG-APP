const express=require("express");
const {createBlog,getBlog,getBlogbyId,deleteBlog,updateBlog, likeBlog, bookmarkblog, searchBlog} = require("../controller/Bloglogic");
const verifyUser = require("../auth/auth");
const upload = require("../utilis/multer");
const route=express.Router();

route.post("/blog",verifyUser,upload.fields([{name:"image"},{name:"images"}]) ,createBlog)
route.get("/blog",getBlog)
route.get(`/searchblog/:keyword`,searchBlog)
route.get("/blog/:blogId",getBlogbyId)
route.delete("/blog/delete/:id" ,verifyUser,deleteBlog)
route.patch("/blog/:blogId",verifyUser,upload.fields([{name:"image"},{name:"images"}]),updateBlog)
route.post("/blog/like/:id",verifyUser,likeBlog)
route.post("/save/:id/bookmark/:blogId",verifyUser,bookmarkblog)
module.exports=route