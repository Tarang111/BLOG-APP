import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast"
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useReducer } from 'react'
import { login, logout } from '../utilis/userSlice'
import { useDispatch } from 'react-redux'
import Input from '../component/Input'
import { FaUserAlt } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { FcGoogle } from "react-icons/fc";
import { RiLockPasswordFill } from 'react-icons/ri'
import { googleAuth } from '../utilis/firebase'
function Authform({type}) {
 const [userdata,setData]=useState({name:"",email:"",password:""})
  const navigate = useNavigate()
  const dispatch=useDispatch()
  
  useEffect(()=>{
      dispatch(logout())
    //   localStorage.setItem("user",json.Stringify(""))
  },[type])
  
         async function handleSubmit() {
              try {
                  const res=await axios.post(`${import.meta.env.VITE_BACKENED_URL}/user/${type}`,userdata)
                   
                    
                  
                      if(type=="signup")
                      {
                            toast.success(res.data.message)
                            return  navigate("/signin")
                      }
                      else{
                      dispatch(login(res.data.user))
                       localStorage.setItem("user",JSON.stringify(res.data.user))
                        toast.success(res.data.message)
                         return  navigate("/")
                      }
                      
                 
                    
                    
              } catch (error) {
                     console.log(error);
                     toast.error(error.response.data.message)
                }
            }
async function handlegooglelogin() {
  try {
    const data = await googleAuth();

    // Cancelled case
    if (!data || !data.user) {
      toast.error("Google login cancelled");
      return;
    }

    const res = await axios.post(
      `${import.meta.env.VITE_BACKENED_URL}/google-auth`,
      {
        accessToken: data.user.accessToken,
        profilePic: data.user.photoURL,
        email: data.user.email,
        name: data.user.displayName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    localStorage.setItem("user", JSON.stringify(res.data.user));
    toast.success(res.data.message);
    dispatch(login(res.data.user));
    navigate("/");
  } catch (error) {
    if (
      error.code === "auth/popup-closed-by-user" ||
      error.code === "auth/cancelled-popup-request"
    ) {
      console.warn("Google sign-in cancelled by user");
      toast.error("Google sign-in cancelled");
    } else {
      console.error("Google login error:", error);
      toast.error("Google login failed");
    }
  }
}



    return (
        <div className=" w-full h-[91.5vh] bg-slate-200 flex justify-center items-center ">

            <div className=" flex gap-2 flex-col border-b-cyan-900 border-2 rounded-lg pt-10 pb-10 w-[300px]  bg-gray-100 justify-center items-center ">
                <h1 className='text-3xl font-serif mb-2  '>
                    {(type=='signin')?"SIGN IN":"SIGN UP"}
                </h1>
                  {/* name */}
               { (type=="signup")?( <Input type={"text"} placeholder={"Enter your name"} setdata={setData} field={"name"}  icon={<FaUserAlt className='text-2xl'/>} />):""}
                 {/* email */}
               
                <Input type={"text"} placeholder={"Enter your email"} setdata={setData} field={"email"} icon={<MdEmail className='text-2xl'/>}/>
                  {/* password */}
                
                <Input type={"password"} placeholder={"Enter your password"} setdata={setData} field={"password"} icon={<RiLockPasswordFill className='text-2xl'/>}/>
                
                <button className='border-2 w-[50%] rounded-[5px] mx-auto pt-1 pb-1 bg-black text-white font-bold ' onClick={handleSubmit}>
                    {(type=="signup")?"Sign up":"Sign in"}
                </button>
                  <p>OR</p>

                  <div className=" flex justify-center items-center gap-2 border-2 rounded-2xl p-1 bg-gray-300 cursor-pointer hover:bg-gray-50" onClick={handlegooglelogin }>
                    <p className='font-bold' >Continue with </p>
                    <FcGoogle className='text-2xl'/>
                   </div>
               {(type=='signin')?"DONT HAVE AN ACCOUNT":"Already have an account"}
               {(type=='signin')?(<Link to={"/signup"}>Register</Link>):(<Link to={"/signin"}>Login</Link>)}
            </div>


        </div>
    )
}

export default Authform