import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { setIsOpen } from '../utilis/commentSlice';
import axios from 'axios'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { addcomment, addcommentlike, deleteComment, setReplies, setUpdatedComments } from '../utilis/blogSlice';
import { jwtDecode } from 'jwt-decode';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaHandPointDown } from "react-icons/fa";

function Comments() {
  const [comment, setcomment] = useState(null)
  const blog = useSelector(slice => slice.blog)
  const [active,setactive]=useState(null)
  const [deletee,setdelete]=useState(null)
  const [commentt,setedit]=useState(null)
  const commentsdata = blog.comments
   const navigate=useNavigate()


  useEffect(() => {
    

  }, [commentsdata, blog])

  const { token } = useSelector(slice => slice.user)
  const { blogId } = useParams()
  const dispatch = useDispatch()
let user = null;

if (token && typeof token === "string") {
  try {
    user = jwtDecode(token)?.id;
  } catch (err) {
    console.error("Invalid or expired token:", err);
    toast.error("Session expired, please login again");
    navigate("/");
  }
} else {
  toast.error("Please Sign in");
  navigate("/signin");
}


 function handleedit(id)
 {
  setactive((prev)=>(prev==id?null:id))
 }
  function handledelete(id)
 {
  setdelete((prev)=>(prev==id?null:id))
 }
 
  async function handlelike(commentid) {
    if (!token) return toast.error("Please login to like blogs");

    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/blog/like/comment/${commentid}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(addcommentlike({ commentId: commentid, userId: user }))
      // Toggle like state
      toast.success(res.data.message)



    } catch (err) {
      console.log(err);

    }
  }
  
  async function deletecommentfunction(id) {
      try {
        console.log(id);
        
         const res=await axios.delete(`http://localhost:3000/api/v1/blog/delete/comment/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
)          
        dispatch(deleteComment({id:id}))
         toast.success(res.data.message)
      } catch (error) {
             toast.error(error.response.data.message)
            console.log(error);
     
      }
  }
 
  
async function editComment(id)
{   
    
   
  try {
      const res= await axios.patch(`http://localhost:3000/api/v1/blog/edit/comment/${id}`,{commentt},
        { headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': "application/json"
        }}
      )
      console.log(res);
      console.log(id);
      
      dispatch(setUpdatedComments({commentedit:commentt,id}))
       setactive((prev)=>(prev==id?null:id))
       toast.success(res.data.message)
  } catch (error) {
    toast.error(error.response.data.message)
     console.log(error);
     
  }
}

async function postcomment() {
    try {
      const res = await axios.post(`http://localhost:3000/api/v1/blog/comment/${blogId}`, { comment }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': "application/json"
        }
      })



      dispatch(addcomment(res.data.comment))
      //  setcommentt(blog.comments.length)
      toast.success(res.data.message)
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }

  }


  const count = blog.comments.length

  return (
    <div className='md:w-[23vw] w-[100vw] drop-shadow-2xl h-screen bg-white top-0 p-4 z-[1000]    md:right-0  fixed border-l flex flex-col overflow-y-scroll gap-5'>
      {/* comment no. and cut */}
      <div className="flex justify-between items-center">
        <h1>Comments ({count})</h1>
        <RxCross2 onClick={() => dispatch(setIsOpen(false))} className='cursor-pointer' />
      </div>
      {/* comment box and button */}
      <div className="">
        <textarea name="" id="" cols="40" rows="5" className='border p-1 resize-none' placeholder='What are your thoughts?' onChange={(e) => (setcomment(e.target.value))}></textarea>
        <div className="">
          <button className='border p-1 rounded-lg text-white bg-gray-800 font-medium' onClick={postcomment}>POST COMMENT</button>
        </div>

      </div>



      <div className=''>
        {
          commentsdata.map((commentt) => (
           
          <div key={commentt._id} className="flex flex-col gap-2 p-2 w-full h-fit border-b">
               
              <div className=" flex justify-between ">
                <div className="flex w-full gap-1 items-center">

                  <div className="w-10 rounded-full">
                    <img className='rounded-full w-full' src={`https://api.dicebear.com/9.x/initials/svg?seed=${commentt.user && commentt.user.name ? commentt.user.name : 'Unknown User'}`} alt="" />
                  </div>

                  <div className=" flex flex-col">
                    <p>{commentt.user && commentt.user.name ? commentt.user.name : 'Unknown User'}</p>
                    <p>{commentt.createdAt ? new Date(commentt.createdAt).toLocaleDateString() : 'Just now'}</p>

                  </div>
                </div>

              </div>


              <p className='break-words'>{commentt.comment}</p>

              <div className="flex justify-between">
                {/* like comment on comment */}
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    {commentt.likes.includes(user) ? (
                      <AiFillLike
                        className="text-[20px] text-blue-500 drop-shadow-[0_0_1px_black] cursor-pointer transition-transform duration-150 active:scale-110"
                        onClick={() => { handlelike(commentt._id) }}
                      />
                    ) : (
                      <AiOutlineLike
                        className="text-[20px] text-black cursor-pointer transition-transform duration-150 active:scale-110"
                        onClick={() => { handlelike(commentt._id) }}
                      />
                    )}
                    <p className="text-[15px]">{commentt.likes.length}</p>
                  </div>

                </div>
           
              </div>

                 {/*Edit and delete popup */}
              {user==commentt.user._id&& <div className=" flex  gap-1  rounded-xl w-fit p-2 absolute  justify-center items-center right-0">
                 <MdEdit className='text-xl cursor-pointer' onClick={()=>{handleedit(commentt._id)}}/>
                 <MdDelete className='text-xl cursor-pointer hover:text-red-600' onClick={()=>{handledelete(commentt._id)}}/>
                 
               </div>}
                
                {
                  active==commentt._id&&<div className=' w-[90%]   '>
                    <p className='flex gap-1.5 justify-center items-center w-fit'>~Edit here <FaHandPointDown/></p>
                    <textarea name="" id="" defaultValue={commentt.comment} rows={5} className='border w-full p-1' onChange={(e)=>{setedit(e.target.value)}}></textarea>
                    <button className='border text-center p-1 font-bold text-white bg-black rounded-xl cursor-pointer' onClick={()=>{editComment(commentt._id)}}>Edit</button>
                  </div>
                 }
                  {
                  deletee==commentt._id&&<div className=''>
                    <div className="">
                           <p className='text-xl'>Are you sure you want to delete?</p>
                           <div className="flex gap-5">
                             <button className='border text-center p-2 font-bold text-white bg-black rounded-xl cursor-pointer' onClick={()=>{deletecommentfunction(commentt._id)}}>Yes</button>
                             <button className='border text-center p-2 font-bold text-white bg-black rounded-xl cursor-pointer' onClick={()=>{handledelete(commentt._id)}}>No</button>
                           </div>
                    </div>
                  </div>
                 }


                 
          
          </div>


          


        ))
         


        }
      </div>
    
    </div>
  )
}


export default Comments