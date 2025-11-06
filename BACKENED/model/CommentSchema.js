const mongoose=require("mongoose")
const commentSchema=new  mongoose.Schema({
   blog:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"blog"
   },
   user:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"user"
   },
    comment:
    {
        type:String,
        required:true
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    //NESTED COMMENT
    replies:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"comment"
        }
    ],
    parentcomment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment",
        default:null,
    }

},
{timestamps:true})
const commentmodel=mongoose.model("comment",commentSchema)
module.exports=commentmodel;