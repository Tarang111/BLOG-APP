import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { followuser } from '../utilis/userSlice'
function Profile() {
    const {username}=useParams()
     const [user,setuser]=useState(null)
     const dispatch=useDispatch()
       
     const userr=useSelector(slice=>slice.user)
     const {token}=useSelector(slice=>slice.user)
     const [tab,settab]=useState("home")
     
     async function fetchuser() {
        try {
             const res= await axios.get(`${import.meta.env.VITE_BACKENED_URL}/user/${username}`)
             toast.success(res.data.message)
             setuser(res.data.user)

             console.log(res);
             
        } catch (error) {
            
        }
     }

     async function handleFollow(id) {
   try {
         const res=await axios.post(`${import.meta.env.VITE_BACKENED_URL}/follow/${id}`,{},{ headers: { Authorization: `Bearer ${token}` } })
          toast.success(res.data.message)
          dispatch(followuser({id}))
        } catch (error) {
             console.log(error);
             
   }
}

      useEffect(()=>{
      fetchuser()
     },[username,userr])
     if (!user) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-lg font-medium">
        Loading profile...
      </div>
    )
  }
  return (
   <div className="mx-auto mt-5 md:w-[70%] w-[100%] flex md:flex-row flex-col">
      <div className="md:w-[60%] w:[100%]  flex flex-col gap-6 p-1">
      <div className="">
          <h1 className='text-2xl font-extrabold'>{user.name}</h1>
        <hr />
        {/* buttons of home like save draft */}
      </div>
         <div className=" flex md:gap-8 gap-1">
          <p className={`border-2 p-1.5  rounded-2xl h-fit text-[14px]  bg-black text-white font-bold cursor-pointer active:bg-gray-500 ${(tab=="home")?"bg-gray-500":""}`}  onClick={()=>{settab("home")}}>Home</p>
{  user.showlike && <p className={`border-2 p-1.5  rounded-2xl h-fit text-[14px] bg-black text-white font-bold cursor-pointer active:bg-gray-500 ${(tab=="liked")?"bg-gray-500":""}`} onClick={()=>{settab("liked")}}>Liked blogs</p>}
        { user.showsave&& <p className={`border-2 p-1.5  rounded-2xl text-[14px] h-fit bg-black text-white font-bold cursor-pointer active:bg-gray-500 ${(tab=="saved")?"bg-gray-500":""}`} onClick={()=>{settab("saved")}}>Saved blogs</p>}
        {userr.username==username&&<p className={`border-2 p-1.5  rounded-2xl h-fit text-[14px] bg-black text-white font-bold cursor-pointer active:bg-gray-500 ${(tab=="draft")?"bg-gray-500":""}`} onClick={()=>{settab("draft")}}>Draft</p>}
         </div>

         {/* home,saved,liked,draft content */}
         <div className=" flex flex-col gap-2">
        {(tab=="home")&&user.blogs.filter((item) => !item.draft).map((item)=>(
          <Link to={`/blog/${item.blogId}`}><div className="border w-full  flex cursor-pointer  gap-2">
             <div className="w-45  border">
              <img src={item.image} alt="" />
             </div>
           <div className="">
             <p className='font-bold'>{item.title}</p>
              <p className='font-normal '>{item.description.slice(0,30)+"..."}</p>
              <p>👆tap to read</p>
           </div>
          </div></Link>
        ))}
      
         {(tab=="liked")&&user.likeblog.filter((item) => !item.draft).map((item)=>(
          <Link to={`/blog/${item.blogId}`}><div className="border w-full  flex cursor-pointer  gap-2">
             <div className="w-45  border">
              <img src={item.image} alt="" />
             </div>
           <div className="">
             <p className='font-bold'>{item.title}</p>
              <p className='font-normal '>{item.description.slice(0,30)+"..."}</p>
              <p>👆tap to read</p>
           </div>
          </div></Link>
        ))}
         
         {(tab=="saved")&&user.saveblog.filter((item) => !item.draft).map((item)=>(
          <Link to={`/blog/${item.blogId}`}><div className="border w-full  flex cursor-pointer  gap-2">
             <div className="w-45  border">
              <img src={item.image} alt="" />
             </div>
           <div className="">
             <p className='font-bold'>{item.title}</p>
              <p className='font-normal '>{item.description.slice(0,30)+"..."}</p>
              <p>👆tap to read</p>
           </div>
          </div></Link>
        ))}

  {(tab == "draft") &&user.blogs.filter((item) => item.draft)
    .map((item) => (
      <Link to={`/blog/${item.blogId}`} key={item._id}>
        <div className="border w-full flex cursor-pointer gap-2">
          <div className="w-45 border">
            <img src={item.image} alt="" />
          </div>
          <div>
            <p className="font-bold">{item.title}</p>
            <p className="font-normal">
              {typeof item.description === "string"
                ? item.description.slice(0, 30) + "..."
                : JSON.stringify(item.description).slice(0, 30) + "..."}
            </p>
            <p>👆tap to read</p>
          </div>
        </div>
      </Link>
    ))}

         </div>
      </div>

      {/* user data */}
      <div className=" p-5 flex flex-col gap-4  md:w-[50%] w-[100%]">
       {/* profile image */}
       <div className="w-12 h-12 border-2  object-cover rounded-full">
        <img className='w-full h-full object-cover rounded-full' src={(user.profilePic)?user.profilePic:`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`} alt="" />
       </div>
       {/* about */}
       <div className=" flex flex-col gap-2">
        <p className='font-bold'>{user.name}</p>
       <p className='font-medium'>{user.followers.length} Followers</p>
       <p>{(user.bio)?user.bio:"no Bio"}</p>
        {userr.id!=user._id&&<p className='border-2 p-1.5 w-fit rounded-2xl text-[14px] bg-black text-white font-bold cursor-pointer active:bg-gray-500'  onClick={()=>{handleFollow(user._id)}}>{userr.following.includes(user._id)?"Unfollow":"Follow"}</p>}
        <Link to={`/editprofile/${userr.id}`}>{userr.id==user._id&&<p className='border-2 p-1.5 w-fit rounded-2xl text-[14px] bg-black text-white font-bold cursor-pointer active:bg-gray-500'  onClick={()=>{}}>Edit Profile</p>}</Link>
       </div>
       {/* following */}
       <div className="">
        <h1>Following</h1>
      {(user.following.length >0)? user.following.map((items)=>(
          <Link to={`/profile/${items.username}`}><div className="w-[100%]  h-fit">
              <div className=" flex  items-center p-1 gap-2">
                  <div className="w-8 h-8 rounded-full">
             <img className='w-full h-full rounded-full' src={(items.profilePic)?items.profilePic:`https://api.dicebear.com/9.x/initials/svg?seed=${items.name}`} alt="" />
              </div>
              <p className='text-[15px] font-medium'>{items.name}</p>
              </div>
              <hr />
          </div></Link>
        )):(<h1>No following found</h1>)}
       </div>
      </div>


   </div>

  )
}

export default Profile