import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from "axios"
import { AiTwotoneLike } from "react-icons/ai";
import { Link } from 'react-router-dom'
import { removeblog } from '../utilis/blogSlice'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineComment } from "react-icons/md";
import { FaBookBookmark } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
function Home() {
  const [data,setdata]=useState([])
  const dispatch=useDispatch()
  const {token}=useSelector(slice=>slice.user)
    const [page,setpage]=useState(1)
    const [pagee,setpagee]=useState(1)
    const [tagss,settagss]=useState(["Nodejs","Tarangmishra","BlogApp","Reactjs","Economy","Politics","Education","Cricket" ,"Technical Project"])
    const [hasmore,setmore]=useState()
     const [hasuser,sethasuser]=useState(true)
    const [user,setuser]=useState([])
    useEffect(()=>{
   fetchBlogs()
   
},[page])
  useEffect(()=>{
   fetchusers()
   
},[pagee])
  const userr=useSelector(slice=>slice.user)
   async function fetchBlogs() {
    const params={page,limit:5}
      const res= await axios.get(`${import.meta.env.VITE_BACKENED_URL}/blog`,{params})
      // settagss(res.data.blog.tags[0].split(","))
     console.log(res);
     
      
      setdata((prev)=>[...prev,...res.data.blog])
      setmore(res.data.hasmore)
}
   async function fetchusers() {
    const params={pagee,limit:5,id:userr.id}
      const res= await axios.get(`${import.meta.env.VITE_BACKENED_URL}/user`,{params})
     
     
       console.log(res);
        
      setuser((prev)=>[...prev,...res.data.user])
      sethasuser(res.data.hasuser)
      console.log(hasuser);
      
}


async function bookmark(blogId) {
  if (!token) return toast.error("Please login to save blogs");

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKENED_URL}/save/${userr.id}/bookmark/${blogId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(res.data.message);
     dispatch(setsaveblog({ blogId }))
    // Toggle local state based on backend message
    if (!res.data.success) {
      setsave(false);
    } else {
      setsave(true);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Failed to save blog");
  }
}
useEffect(()=>{
    
      dispatch(removeblog({}))
},[])

 return (
    <div className='flex w-[100%] gap-2 md:justify-end justify-center '>
       <div className="md:w-[60%] w-[80%] mt-2 mb-2 flex flex-col gap-4  ">
       { data.map((blog,i)=>(
        <Link to={"blog/"+blog.blogId} key={blog.blogId}>
          <div key={blog.blogId} className="flex w-[100%] gap-15 min-h-[35vh] md:flex-row flex-col  rounded-sm border-2 p-2 justify-between  ">
          
          <div className=" flex flex-col  md:w-[50%] w-[100%]  gap-4">
             <div className="flex rounded-full items-center gap-1 ">
              <img src={(blog.creator.profilePic)?blog.creator.profilePic:`https://api.dicebear.com/9.x/initials/svg?seed=${blog.creator.name}`} className='w-8 h-8 rounded-full' alt="" />
              <p >{blog.creator.name}</p>
             </div>
      
              <h2 className='font-bold line-clamp-1   text-3xl'>{blog.title}</h2>
        
            <h4 className='font-light line-clamp-4 '>{blog.description}</h4>
            <div className=" flex items-center md:flex-row   gap-8">
              <p>{blog.createdAt.slice(0,10)}</p>
        
              <div className="flex items-center gap-1">
               <AiTwotoneLike className='text-[20px]'/> <p>{blog.likes.length}</p>
            </div>
            <div className="flex items-center justify-between gap-1">
               <MdOutlineComment className='text-[20px]'/> <p>{blog.comments.length}</p>
            </div>
            {/* BOOKMARK */}
            <div className="">
                       {(userr.saveblog.includes(blog._id))?<FaBookmark className='cursor-pointer' onClick={(e)=>{bookmark(blog._id)}}/>:<FaRegBookmark className='cursor-pointer'  onClick={()=>{bookmark(blog._id)}}/>}
            </div>
        
            </div>
        

           <div className=" flex gap-2 w-[90%] overflow-hidden ">
                 {blog.tags[0].length>0 &&blog.tags[0].split(",").map((item,index)=>(
                      <p className="border-2 p-2 w-fit rounded-2xl text-[10px] flex justify-center items-center gap-2 bg-black text-white font-bold">#{item} 
                     
                      </p>
                         
                  )
          
                  )}
           </div>

          </div>

          <div className=" h-full  flex justify-center items-center W-[40%]">
            <img  className="w-full h-full max-h-[250px] hover:scale-102 object-cover rounded-md"  src={blog.image} alt="" />
          </div>
        </div>
        </Link>
   
        ))
       
        }

    
    {hasmore&&   <button className='border-2 p-1.5 w-fit mx-auto rounded-2xl text-[14px] bg-black text-white font-bold cursor-pointer active:bg-gray-500' onClick={()=>{setpage(prev=>++prev) }}>Load more</button>}
       </div>



       <div className="min-h-screen w-[30%]  md:block hidden sm:flex  flex-col gap-10 border-l-2 p-2 ">
       <div className=" flex flex-col gap-3">
        <h1 className='text-3xl font-bold'> Recommended <span className='text-gray-500 font-bold'>Topics</span> </h1>
            <div className=" flex gap-2 w-[100%] flex-wrap">
                           {tagss.map((item,index)=>(
                    <Link to={`/search/${item}`}><p className="border-2 p-2 w-fit rounded-2xl text-[15px] cursor-pointer flex justify-center items-center gap-2 bg-black text-white font-bold">#{item} </p>
                                   </Link>
                            )
                    
                            )}
                     </div>
       </div>
      { token&&<div className="flex flex-col gap-2">
      <h1 className='text-3xl font-bold'>Who to <span className='text-gray-500 font-bold'>follow</span> </h1>
    { user.length>0?  user.map((items)=>(
                 <Link to={`/profile/${items.username}`}><div className="w-[100%]  h-fit">
                     <div className=" flex  items-center border-b p-1 gap-2">
                         <div className="w-8 h-8 rounded-full">
                    <img className='w-full h-full rounded-full' src={(items.profilePic)?items.profilePic:`https://api.dicebear.com/9.x/initials/svg?seed=${items.name}`} alt="" />
                     </div>
                     <p className='text-[15px] font-medium'>{items.name}</p>
                     </div>
                     
                 </div></Link>
       )):<h1>No User Found</h1>}
         {hasuser&&   <button className='border-2 p-1.5 w-fit mx-auto rounded-2xl text-[14px] bg-black text-white font-bold cursor-pointer active:bg-gray-500' onClick={()=>{setpagee(prev=>++prev) }}>Load more</button>}
       </div>}

       </div>
    </div>

  )
}

export default Home