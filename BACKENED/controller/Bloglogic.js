const blogmodel = require("../model/Blogschema");
const usermodel = require("../model/Userschema");
const upload = require("../utilis/multer");
const ShortUniqueId = require('short-unique-id');
 const uid=new ShortUniqueId({length:10})
const {uploadImage, deleteImage} = require("../utilis/uploadImage");
const fs=require("fs");
const path = require("path");
const commentmodel = require("../model/CommentSchema");




async function createBlog(req,res) {
  try{
  
       const {image,images}=req.files
      
 
       const creator=req.user
       const {title,description,draft,tags}=req.body
      const content=JSON.parse(req.body.content)
         
        
         
       if(!title||!description||!content)
       {
        res.status(500).json({
            success:false,
            message:"PLEASE FILL ALL THE DETAILS OF BLOG"
        })
       }
        const blogId=title.toLowerCase().split(" ").join("-")+"-"+ uid.randomUUID()
        let imageindex = 0;
for (let i = 0; i < content.blocks.length; i++) {
    const block = content.blocks[i];
    
    // 1. Check if it's an image block AND we have a corresponding uploaded file
    if (block.type === "image" && imageindex < images.length) {
        
        const uploadedFile = images[imageindex];
        
        // **CRITICAL FIX:** Use the correct MIME type from the file object
        const mimeType = uploadedFile.mimetype; // e.g., 'image/png' or 'image/jpeg'
        
        // Convert the buffer to Base64
        const base64Data = uploadedFile.buffer.toString("base64");
        
        // Construct the correct data URI string
        const dataUri = `data:${mimeType};base64,${base64Data}`;
        try {
            const { secure_url, public_id } = await uploadImage(dataUri);
            block.data.file = {
               
                url: secure_url,
                imageid: public_id
            };
            
            
            
            imageindex++;
            
        } catch (error) {
            console.error("Image upload failed:", error);
        }
    }
}

// Ensure you also handle the main cover image separately if needed.
           const mimeType=image[0].mimetype;
           const base64data=image[0].buffer.toString("base64");
           const dataUri=`data:${mimeType};base64,${base64data}`
          const url= await uploadImage(dataUri)
       const newblog= await blogmodel.create({title,description,draft,creator,image:url.secure_url,imageid:url.public_id,blogId,content,tags}) 
        
         
        await usermodel.findByIdAndUpdate(creator,{$push:{blogs:newblog._id}})
          
       res.status(200).json({
           success:true,
           message:"BLOG CREATED SUCCESSFULLY",
           blog:newblog
     })

 
}
catch(err){
       res.status(500).json({
           success:false,
           message:"CANNOT CREATE BLOG",
           blog:null,
           Error:err
     })
}

}

async function bookmarkblog(req, res) {
  const { id, blogId } = req.params;

  try {
    const user = await usermodel.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const blog = await blogmodel.findById(blogId);
    if (!blog) {
      return res.status(400).json({
        success: false,
        message: "Blog not found",
      });
    }

    // If blog already saved → remove it
    if (user.saveblog.includes(blogId)) {
      await usermodel.findByIdAndUpdate(id, { $pull: { saveblog: blogId } });
      return res.status(200).json({
        success: false,
        message: "Blog unsaved",
        saved: false,
      });
    }

    // Otherwise → save it
    await usermodel.findByIdAndUpdate(id, { $push: { saveblog: blogId } });
    return res.status(200).json({
      success: true,
      message: "Blog saved",
      saved: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
async function getBlog(req,res){
     const page=parseInt(req.query.page)
     const limit=parseInt(req.query.limit)

     
    try{
          const skip = (page - 1) * limit

          const blogs= await blogmodel.find({draft:false}).populate(
            {
              path:"creator",
              select:"-password"
            }
          ).populate({
            path:"likes",
            select:"-password"
          }).sort({createdAt:-1})
          .skip(skip)
          .limit(limit)
           const totalblog=await blogmodel.countDocuments({ draft: false })
          
           
        res.status(200).json({
              success:true,
              message:"BLOGS RETRIEVED",
              blog:blogs,
              hasmore:(skip+limit<totalblog)
            
        })  

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"CANT GET BLOGS"
        })
    }
}
async function searchBlog(req, res) {
  const search = req.params.keyword;
  const page=parseInt(req.query.page)
  const limit=parseInt(req.query.limit)
 try{
          const skip = (page - 1) * limit
    const blogs = await blogmodel
      .find({
        draft: false, 
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          {tags:{$regex:search,$options:"i"}},
        ],
      })
          
          
      .populate({
        path: "creator",
        select: "-password",
      })
      .populate({
        path: "likes",
        select: "-password",
      }).sort({createdAt:-1}).skip(skip)
          .limit(limit);
const totalblog=await blogmodel.countDocuments({ draft: false ,$or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],})
    res.status(200).json({
      success: true,
      message: "BLOGS RETRIEVED",
      blog: blogs,
       hasmore:(skip+limit<totalblog)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "CANT GET BLOGS",
    });
  }
}

async function getBlogbyId(req,res) {
     try{
        const { blogId}=req.params
    
        
        const blog= await blogmodel.findOne({blogId}).populate({
          path:"comments",
          populate:{
            path:"user",
            select:"name email"
          }
        })
        await blog.populate({
          path:"creator",
          select:"-password"
        })
      
     

 

      
      
         

       res.status(200).json({
        "success":true,
        "message":"BLOG RETRIEVED",
          "blog":blog
       })
  }
  catch(err){
       res.status(500).json({
        "success":false,
        "Message":"CANNOT RETRIEVE BLOG DATA"
       })
  }

}

async function updateBlog(req,res) {
  try {
    const creator = req.user;
    const blogId = req.params.blogId;
    const id = blogId.startsWith(":") ? blogId.substring(1) : blogId;
     const image=req.files
     const content=JSON.parse(req.body.content)
     const existingimage=JSON.parse(req.body.existingimage) 
     
     
    const { title, description, draft ,tags} = req.body;
    
    
    const blog = await blogmodel.findOne({ blogId: id });
     
    if (!blog) {
    return res.status(404).json({ success: false, message: "BLOG NOT FOUND" });
    }

    if (blog.creator.toString() !== creator.toString()) {
    return res.status(403).json({ success: false, message: "YOU ARE NOT AUTHORIZED TO UPDATE" });
    }
     
    

    let imagetodelete=content.blocks.filter(
      (block)=>{if(block.type=="image") 
        return block}).filter((block)=>{if(!existingimage.find(({url})=>url==block.data.file.url)) 
          return block }).map((block)=>(block.data.file.imageid))

      if(imagetodelete.length>0)
      {
        await Promise.all(
          imagetodelete.map((id)=>(deleteImage(id)))
        )
      }
      if(req.files.images){
  let imageindex = 0;
for (let i = 0; i < content.blocks.length; i++) {
    const block = content.blocks[i];
    
    // 1. Check if it's an image block AND we have a corresponding uploaded file
    if (block.type === "image" && imageindex < req.files.images.length && block.data.file.image) {
        
        const uploadedFile = req.files.images[imageindex];
        
        // **CRITICAL FIX:** Use the correct MIME type from the file object
        const mimeType = uploadedFile.mimetype; // e.g., 'image/png' or 'image/jpeg'
        
        // Convert the buffer to Base64
        const base64Data = uploadedFile.buffer.toString("base64");
        
        // Construct the correct data URI string
        const dataUri = `data:${mimeType};base64,${base64Data}`;
        try {
            const { secure_url, public_id } = await uploadImage(dataUri);
            block.data.file = {
               
                url: secure_url,
                imageid: public_id
            };
            
            
            
            imageindex++;
            
        } catch (error) {
            console.error("Image upload failed:", error);
        }
    }
}
}



    let url = null;
    if (req.files.image) {
            const mimeType=req.files.image[0].mimetype;
           const base64data=req.files.image[0].buffer.toString("base64");
           const dataUri=`data:${mimeType};base64,${base64data}`
           url= await uploadImage(dataUri)
      
      deleteImage(blog.imageid);
      
    }

    // ✅ only update the fields that are provided
    if (title) blog.title = title;
    if (description) blog.description = description;
     blog.draft = draft||blog.draft;
     blog.tags=tags||blog.tags
    if (url) {
      blog.image = url.secure_url;
      blog.imageid = url.public_id;
    }
    blog.content= content||blog.content

    await blog.save();

    res.status(200).json({
      success: true,
      message: "BLOG UPDATED SUCCESSFULLY",
      blog,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "BLOG UPDATE FAILED",
      error: err.message,
    });
  }
}

async function deleteBlog(req,res){
    try{
              const creator=req.user
            const blog= await blogmodel.findById(req.params.id)
              
               if(!blog)
              {
               return  res.status(500).json({
               success:false,
               message:"BLOG NOT FOUND"
              }) 
              }

             if(!(blog.creator==creator))  
            {
              return res.status(500).json({
                success:false,
                message:"YOU ARE NOT AUTHORIZED TO DELETE"
              })
            }
            
             await usermodel.findByIdAndUpdate(
         creator,
         { $pull: { blogs: req.params.id } },
         { new: true }
    );
            await blogmodel.findByIdAndDelete(req.params.id)
             deleteImage(blog.imageid)
                {blog.content.blocks.map((item)=>
                  {
                    if(item.type=="image")
                      (deleteImage(item.data.file.imageid)
                    )})}
             await commentmodel.deleteMany({blog:blog._id}) 

          res.status(200).json({
            success:true,
            message:"DELETED SUCCESSFULLY",
            
          })



    }
    catch(err){
    res.status(500).json({
            success:false,
            message:"DELETION UNSUCCESSFULL",
            BlogDeleted:null
          })

    }
}

async function likeBlog(req,res) {
     try{
            const user=req.user
            const id=req.params.id
           
           const blog= await blogmodel.findById(id)
              if(!blog)
              {
               return  res.status(500).json({
               success:false,
               message:"BLOG NOT FOUND"
              }) 
              }
              if(!(blog.likes.includes(user)))
              {
                await blogmodel.findByIdAndUpdate(id,{$push:{likes:user}})
                await usermodel.findByIdAndUpdate(user,{$push:{likeblog:id}})
                return res.status(200).json({
                   success:true,
                   message:" BLOG LIKED SUCCESSFULLY"
                },{new:true})
              }
              else
              {
                await blogmodel.findByIdAndUpdate(id,{$pull:{likes:user}})
                await usermodel.findByIdAndUpdate(user,{$pull:{likeblog:id}})
                  return res.status(200).json({
                   success:true,
                   message:" BLOG DISLIKED SUCCESSFULLY"
                },{new:true})
              }
                   
            }             
            
            
  

  
    
  catch{
 res.status(500).json({
          "success":false,
          "MESSAGE":"ACTION FAILED"
        })
  }
}
module.exports={createBlog,getBlog,getBlogbyId,deleteBlog,updateBlog,likeBlog,bookmarkblog,searchBlog}