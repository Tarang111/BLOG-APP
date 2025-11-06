const mongoose=require("mongoose");
const usermodel = require("./Userschema");
const blogschema=new mongoose.Schema({
    title :{
        type:String,
        required:true,
        trim:true,
    },
    description :String,
    content:{
        type:Object,
        required:true,
    },
    draft :
    {
        type:Boolean,
        default:false
    },
    tags:{
        type:[String]
    },
    creator:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"user",
           required:true

    },
    blogId:{
         type:String,
         required:true,
         unique:true,
         
    },
    likes:[
         {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
         }

    ],
    image:{
            type:String,
            required:true
    },
    imageid:{
            type:String,
            required:true
    },
    comments:[
         {
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
         }

    ],
   
},{timestamps:true})
const blogmodel=mongoose.model("blog",blogschema)
module.exports=blogmodel