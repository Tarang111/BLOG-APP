import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

function VerifyUser() {
     const {token}=useParams()
    
       useEffect(()=>{
    
     },[token])
      const navigate=useNavigate()
     async function Verifyuser() {
         try {
            const res=await axios.get(`${import.meta.env.VITE_BACKENED_URL}/user/verifyemail/${token}`)
            toast.success(res.data.message)
            console.log(res);
            
            return navigate("/signin")
         } catch (error) {
              toast.error(error.response.data.message)
              console.log(error);
              
         } 
         finally
         {
               return navigate("/signin")
         }
     }
       Verifyuser()
  return (
    <div>VerifyUser</div>
  )
}

export default VerifyUser