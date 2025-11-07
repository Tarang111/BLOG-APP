const usermodel = require("../model/Userschema");
const bcrypt=require("bcrypt");
const { generateJwt,verifyToken } = require("../utilis/jwttokens");
const  transporter  = require("../utilis/verifyUser");
const { trusted } = require("mongoose");
var admin = require("firebase-admin");
const {getAuth} =require("firebase-admin/auth");
const { verify } = require("jsonwebtoken");
const ShortUniqueId = require('short-unique-id');
 const uid=new ShortUniqueId({length:5})
 require("dotenv").config()
admin.initializeApp({
  credential: admin.credential.cert({
  "type": "service_account",
  "project_id": process.env.FIREBASE_projectid,
  "private_key_id":process.env.FIREBASE_private_key_id,
  "private_key": process.env.FIREBASE_private_key.replace(/\\n/g, '\n'),
  "client_email":process.env.FIREBASE_client_email,
  "client_id": process.env.FIREBASE_client_id,
  "auth_uri": process.env.FIREBASE_auth_uri,
  "token_uri": process.env.FIREBASE_token_uri,
  "auth_provider_x509_cert_url": process.env.FIREBASE_auth_provider_x509_cert_url,
  "client_x509_cert_url": process.env.FIREBASE_client_x509_cert_url,
  "universe_domain": "googleapis.com"
}
)
});
async function createUser(req, res) {
  const { name, email, password } = req.body;
  
     
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "FILL ALL CREDENTIALS"
      });
    }
           const hashedpass= await bcrypt.hash(password,10)
           const username=email.split("@")[0]+uid.rnd()
        
           
           const newuser = await usermodel.create({ 
             name, 
             email,
             password:hashedpass,
             username
            });
            
            const token= await generateJwt({
              name,
              id:newuser._id,
              email
      
          })
     res.status(200).json({
      success: true,
      message: "PLEASE VISIT YOUR EMAIL TO VERIFY",
     
 
    });
       transporter.sendMail({
           from:process.env.EMAIL_USER,
           to:email,
           subject:"Email Verification",
           text:"PLEASE CLICK ON THE LINK TO VERIFY YOUR EMAIL",
           html:`<h1>Please click on verify</h1>
           <a href="https://trendingblogapp-kappa.vercel.app/verifyemail/${token}">Verify Now!!!</a>`
        })
      
  
  } catch (err) {
     if(err.code==11000){
        return res.status(500).json({
            "success":false,
            "message":"NO DUPLICACY OF EMAIL IS ALLOWED"
        })
     }
    
     
    
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
     
    });
  }
}
async function verifyUserviatoken(req,res) {
     const {token}=req.params
     try {
           const verifiedtoken=await verifyToken(token)
           if(!verifiedtoken)
           {
            res.status(500).json({
              success:false,
              message:"Invalid Token /session Expired"
            })
           }
              const user= await usermodel.findByIdAndUpdate(verifiedtoken.id,{verify:true},{new:true})
                if(!user)
                {
                   res.status(500).json({
                 success:false,
                  message:"User not Found"
               }) 
               }
                return res.status(200).json({
                  success:true,
                  message:"Verified Succesfully"
                })
     } catch (error) {
           res.status(500).json({
            success:false,
             message:"TRY AGAIN LATER",
             error
      })
     }
     
}
async function googleAuthentication(req,res) {
    try {
        const {accessToken,profilePic}=req.body
        
        const response= await getAuth().verifyIdToken(accessToken)
        const { name, email } = response;
       
        
        
    let user = await usermodel.findOne({ email });

    if (user) {
      // already registered
      if (user.googleAuth) {
        let token = await generateJwt({
          email: user.email,
          id: user._id,
        });
      
        return res.status(200).json({
          success: true,
          message: "logged in successfully",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePic:user.profilePic||profilePic,
            bio:user.bio,
            token, followers:user.followers,
           following:user.following,
            username:user.username,
            saveblog:user.saveblog
            }})
       
        }
        else {
        return res.status(400).json({
          success: true,
          message:
            "This email already registered without google. please try through login form",
        });
      }
        }
          const username=email.split("@")[0]+uid.randomUUID()
         let newUser = await usermodel.create({
      name,
      email,
      googleAuth: true,
      verify:true,
      profilePic,
      username,
      
      
         })  
       let token = await generateJwt({
      email: newUser.email,
      id: newUser._id,
    });

    return res.status(200).json({
      success: true,
      message: "Registration  successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
         token,
         username,
         saveblog,
         
      }})
        
    } catch (error) {
         return res.status(500).json({
      success: false,
      message: "Please try again",
      error: error.message,
    });
         
    }
}
async function loginUser(req,res){

try{
     const {email,password}=req.body;
     const checkuser= await usermodel.findOne({email})
    
     
     if(!checkuser)
     {
      return  res.status(500).json({
             message:"USER DOESNT EXIST"
      })
     }
         if(checkuser.googleAuth)
    {
      res.status(400).json({
        success:false,
        message:"User Registered with Gooogle Try login with Google"
      })
    }
    const checkpass= await bcrypt.compare(password,checkuser.password)
    if(!checkpass)
    {
      return  res.status(500).json({
            success:false,
             message:"INCORRECT PASSWORD OR EMAIL"
      })
    }
  
    const token= await generateJwt(
      {
        id:checkuser._id,
        email,
        
      }
    )

     if(!(checkuser.verify))
     {
  res.status(500).json({
    success:true,
    message:"PLEASE VISIT MAIL AND VERIFY FIRST",
 
   })

     }

   res.status(200).json({
    success:true,
    message:"LOGGED IN SUCCESSFULLY",
  user:{
      name:checkuser.name,
    email:checkuser.email,
    id:checkuser._id,
    token,
    bio:checkuser.bio,
    username:checkuser.username,
    followers:checkuser.followers,
    following:checkuser.following,
    profilePic:checkuser.profilePic,
    saveblog:checkuser.saveblog
  }
   })


}
catch{
     res.status(500).json({
            success:false,
             message:"TRY AGAIN LATER"
      })
}



}
async function getAllUser(req, res) {
  const page = parseInt(req.query.pagee);
  const limit = parseInt(req.query.limit) ;
  
  const skip = (page - 1) * limit;
  const userid = req.query.id; // Assuming req.user contains the current user's _id

 
  try {
    // Fetch all users except the logged-in one, with pagination
    const users = await usermodel
      .find({ _id: { $ne: userid },followers:{$ne:userid} }) // exclude logged-in user
      .select("-password")            // exclude password field
      .skip(skip)
      .limit(limit);

    // Get total number of users excluding the current user
    const totalUsers = await usermodel.countDocuments({ _id: { $ne: userid }, followers:{$ne:userid}});

    res.status(200).json({
      success: true,
      message: "USERS RETRIEVED",
      user: users,
      hasuser: (skip + limit) < totalUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "CANNOT RETRIEVE USER DATA",
    });
  }
}

async function follow(req,res) {
   try {
      const user=req.user
      const {id}=req.params
      if(!user)
      {
        return res.status(400).json({
          success:false,
          message:"Login first"
        })
      }
      const userr=await usermodel.findById(user)
      if(userr.following.includes(id))
      {
        await usermodel.findByIdAndUpdate(user,{$pull:{following:id}})
        await usermodel.findByIdAndUpdate(id,{$pull:{followers:user}})
      
         res.status(200).json({
          success:true,
          message:"Unfollowed succesfully" 
        })

      }
      else
      {
         await usermodel.findByIdAndUpdate(user,{$push:{following:id}})
        await usermodel.findByIdAndUpdate(id,{$push:{followers:user}})
       
       res.status(200).json({
          success:true,
          message:"Followed succesfully" 
        })
      }
   } catch (error) {
     return res.status(400).json({
        success:false,
        message:" unsuccesfull attempt" 
      })
   }
    
}
async function getUserbyId(req,res) {
     const username=req.params.id
  try{
        const user= await usermodel.findOne({username}).populate({
          path:"following blogs followers likeblog saveblog",
          select:"-password"
        })

       res.status(200).json({
        "success":true,
        message:"USER RETRIEVED",
          user:user
       })
  }
  catch(err){
       res.status(500).json({
        "success":false,
        message:"CANNOT RETRIEVE USER DATA"
       })
  }

}

async function updateUser(req,res) {
     try {
    const { name, username, bio,removePic,showlike ,showsave} = req.body
    const updateData = { name, username, bio ,showlike,showsave}

    // If image uploaded
    if (req.file) {
      const imageBuffer = req.file.buffer
      const imageUrl = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`
      updateData.profilePic = imageUrl
    }
     else if (removePic === 'true') {
      updateData.profilePic = null // or null — whichever you store in DB
    }
    const updatedUser = await usermodel.findByIdAndUpdate(
      req.user,
      updateData,
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Error updating profile' })
  }
}

async function deleteUser(req,res){
    try{
          const user= await usermodel.findByIdAndDelete(req.params.id)
          res.status(200).json({
            success:true,
            message:"DELETED SUCCESSFULLY",
            UserDeleted:user
          })



    }
    catch{
    res.status(500).json({
            success:false,
            message:"DELETION UNSUCCESSFULL",
            UserDeleted:null
          })

    }
}


module.exports={createUser,updateUser,getAllUser,loginUser,deleteUser,getUserbyId,verifyUserviatoken,googleAuthentication,follow}
