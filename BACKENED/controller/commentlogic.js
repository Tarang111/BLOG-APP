const blogmodel = require("../model/Blogschema")
const commentmodel = require("../model/CommentSchema")

async function commentBlog(req, res) {
  try {
    const creator = req.user;
    const id = req.params.id; 
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "KINDLY COMMENT BEFORE PERFORMING ACTION"
      });
    }

    const blog = await blogmodel.findOne({ blogId: id });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "BLOG NOT FOUND"
      });
    }
     
    const commentdone = await commentmodel.create({
      comment,
      blog: blog._id,
      user: creator,
    });
   await commentdone.populate({
    path:"user",
    select:"-password"
   })
    
    // ✅ properly await population
 
 console.log(commentdone);
    await blogmodel.findOneAndUpdate(
      { blogId: id },
      { $push: { comments: commentdone._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "COMMENT PUBLISHED",
      comment: commentdone
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "ACTION FAILED"
    });
  }
}

async function deleteComment(req,res) {
     try{
            const userId=req.user
            const id=req.params.id
            
          const comment= await commentmodel.findById(id).populate({
            path:"blog",
            select:"creator"
          })
          if(!comment)
          {
            return res.status(500).json({
              success:false,
              message:"COMMENT NOT FOUND"
            })
          }
         if(comment.user!=userId && comment.blog.creator!=userId)
          {
            return res.status(500).json({
                    success:false,
                    message:"YOU ARE NOT AUTHORIZED TO DELETE"
            })
          }
          await blogmodel.findByIdAndUpdate(comment.blog,{$pull:{comments:id}})
          await commentmodel.findByIdAndDelete(id)
             
              return res.status(200).json({
              success:true,
              message:"COMMENT DELETED",
              
             })
        }             
  catch{
 res.status(500).json({
          "success":false,
          "MESSAGE":"ACTION FAILED"
        })
  }
}
async function editComment(req,res) {
     try{
            const creator=req.user
            const id=req.params.id
            const commmentFetched=await commentmodel.findById(id)
            const {commentt}=req.body
            
            
               console.log(commentt);
               
            if(!commmentFetched)
            {
              return res.status(500).json({
                success:false,
                message:"COMMENT NOT FOUND"
              })
            }
            if(!(creator==commmentFetched.user))
            {
                return res.status(500).json({
                    success:false,
                    message:"YOU ARE NOT AUTHORIZED TO EDIT THIS COMMENT"
                })
            }
            if(!commentt)
            {
              return res.status(500).json({
                success:false,
                message:"KINDLY  COMMENT BEFORE PERFOMING ACTION"
              })
            }
             
              commmentFetched.comment=commentt||commmentFetched.comment
              commmentFetched.save()
        
          
             return res.status(200).json({
              success:true,
              message:"COMMENT UPDATED",
              commentt
             })
          
                   
            }             
    catch{
 res.status(500).json({
          "success":false,
          "MESSAGE":"ACTION FAILED"
        })
  }
}
async function likeComment(req,res) {
     try{
            const userId=req.user
            const id=req.params.id
            const commmentFetched=await commentmodel.findById(id)
             if(!commmentFetched)
            {
              return res.status(500).json({
                success:false,
                message:"COMMENT NOT FOUND"
              })
            }
            if(!(commmentFetched.likes.includes(userId)))
            {  
                 await commentmodel.findByIdAndUpdate(id,{$push:{likes:userId}})  
                return res.status(200).json({
                success:true,
                message:"COMMENT LIKED SUCCESFULLY"
              })
            }
            else{
                await commentmodel.findByIdAndUpdate(id,{$pull:{likes:userId}})  
                  return res.status(200).json({
                success:true,
                message:"COMMENT DISLIKED SUCCESFULLY"
              })
            }
          
          
          
                   
            }             
    catch{
 res.status(500).json({
          "success":false,
          "MESSAGE":"ACTION FAILED"
        })
  }
}
async function addNestedComment(req, res) {
  try {
    const user = req.user;
    const {id,parentComment} = req.params; 
    const { reply } = req.body;
    console.log(id);
    console.log(parentComment);
    
    
     const comment= await commentmodel.findById(parentComment)
     const blog = await blogmodel.findOne({ blogId: id });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "BLOG NOT FOUND"
      });
    }
     if (!comment) {
      return res.status(404).json({
        success: false,
        message: " Parent Comment NOT FOUND"
      })
    }
      if (!reply) {
      return res.status(400).json({
        success: false,
        message: "KINDLY COMMENT BEFORE PERFORMING ACTION"
      });
    }
    const nestedComment = await commentmodel.create({
      comment:reply,
      blog: blog._id,
      user,
      parentComment:parentComment
    });
    await nestedComment.populate({
    path:"user",
    select:"name email"
   })
    
    
    // await blogmodel.findOneAndUpdate(
    //   { blogId: id },
    //   { $push: { comments: nestedComment._id } },
    //   { new: true }
    // );
    await commentmodel.findByIdAndUpdate(parentComment,{$push:{replies:nestedComment._id}},{new:true})

    return res.status(200).json({
      success: true,
      message: "REPLY ADDED SUCCESFULLY",
      comment: nestedComment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "ACTION FAILED"
    });
  }
}
module.exports={commentBlog,deleteComment,editComment,likeComment,addNestedComment}