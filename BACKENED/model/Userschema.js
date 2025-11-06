const mongoose=require("mongoose");
const blogmodel = require("./Blogschema");


const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
    },
    username:{
         type:String,
         unique:true
    },
    password:String,
    blogs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"blog"
        }
    ],
    verify:{
        type:Boolean,
        default:false
    },
    googleAuth:{
        type:Boolean,
        default:false
    },
    profilePic:{
        type:String,
        default:null

    },
    bio:{
        type:String,
        default:null
    },
    saveblog:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blog"
    }],
     likeblog:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blog"
    }],
    showlike:{
        type:Boolean,
        default:true
    },
      showsave:{
        type:Boolean,
        default:true
    },
     followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
      following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],


})
const usermodel=mongoose.model("user",userschema)
module.exports=usermodel;