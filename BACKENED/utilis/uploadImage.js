const cloudinary=require('cloudinary').v2
async function uploadImage(imagepath)
{
try{
       const result=await cloudinary.uploader.upload(imagepath,{
         folder:"BLOG APP",
        
    })
    return result;
    
}
catch(err)
{
    console.log(err.message);
    
}
}
async function deleteImage(imagepath)
{
try{
       await cloudinary.uploader.destroy(imagepath)
    
    
}
catch(err)
{
    console.log(err.message);
    
}
}
module.exports={uploadImage,deleteImage}