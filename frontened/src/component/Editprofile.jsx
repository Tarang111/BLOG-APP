import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import toast from 'react-hot-toast'
import { login } from '../utilis/userSlice'
import { useNavigate } from 'react-router-dom'

function Editprofile() {
  const dispatch = useDispatch()
  const userData = useSelector(slice => slice.user)
  const { bio, profilePic, name, username,showlike, token,id,showsave } = userData
  const navigate=useNavigate()
 
  
  const [newuserdata, setuserdata] = useState({
    bio: bio || '',
    profilePic: profilePic || '',
    name: name || '',
    username: username || '',
    showlike:showlike||true,
    showsave:showsave||true,
  })
useEffect(()=>{},[userData])

  const [loading, setLoading] = useState(false)
 const [removePic, setRemovePic] = useState(false)

const handleRemove = () => {
  setuserdata(prev => ({ ...prev, profilePic: '' }))
  setRemovePic(true)
  const fileInput = document.getElementById('image')
  if (fileInput) fileInput.value = ''
}

  // ✅ Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setuserdata({ ...newuserdata, profilePic: file })
    }
    else{
       setuserdata({ ...newuserdata})
    }
   
  }

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setuserdata({ ...newuserdata, [name]: value })
  }

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', newuserdata.name)
    formData.append('username', newuserdata.username)
    formData.append('bio', newuserdata.bio)
    formData.append('removePic', removePic)
    formData.append('showlike', newuserdata.showlike)
   formData.append('showsave', newuserdata.showsave)
   
    
 if (newuserdata.profilePic && typeof newuserdata.profilePic !== "string") {
  formData.append("profilePic", newuserdata.profilePic);
}

      
       

  
    
    try {
      setLoading(true)
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKENED_URL}/editprofile/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
     console.log(res);
        
      if (res.data.success) {
  toast.success('Profile updated successfully ✅')
  dispatch(login({ ...res.data.user,id:res.data.user._id, token }))
  navigate(`/profile/${res.data.user.username}`)
   // ✅ keep your old token
}
 else {
        toast.error(res.data.message || 'Something went wrong')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to update profile ❌')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 items-center p-4 w-full max-w-md mx-auto"
    >
      {/* Profile Image */}
      <div className="w-[150px] h-[150px] cursor-pointer aspect-square rounded-full overflow-hidden">
        <label htmlFor="image" className="cursor-pointer">
          {newuserdata?.profilePic ? (
            <img
              src={
                typeof newuserdata?.profilePic === 'string'
                  ? newuserdata?.profilePic
                  : URL.createObjectURL(newuserdata?.profilePic)
              }
              alt="Profile"
              className="rounded-full w-full h-full object-cover"
            />
          ) : (
            <div className="w-[150px] h-[150px] bg-white border-2 border-dashed rounded-full flex justify-center items-center text-xl">
              Select Image
            </div>
          )}
        </label>
        <input
          id="image"
          type="file"
          accept=".png, .jpeg, .jpg"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      {/* remove button */}
     <p className='border-2 p-1.5 w-fit rounded-2xl text-[14px] bg-black text-white font-bold cursor-pointer active:bg-gray-500' onClick={()=>{handleRemove()}}>Remove</p>
      {/* Name Input */}
      <input
        type="text"
        name="name"
        value={newuserdata.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full border p-2 rounded-lg outline-none focus:ring focus:ring-blue-300"
      />

      {/* Username Input */}
      <input
        type="text"
        name="username"
        value={newuserdata.username}
        onChange={handleChange}
        placeholder="Username"
        className="w-full border p-2 rounded-lg outline-none focus:ring focus:ring-blue-300"
      />

      {/* Bio Input */}
      <textarea
        name="bio"
        value={newuserdata.bio}
        onChange={handleChange}
        placeholder="Write your bio..."
        className="w-full border p-2 rounded-lg outline-none focus:ring focus:ring-blue-300"
        rows="3"
      />
       
         <label htmlFor="" className="text-2xl">Show liked blog:-</label>
        <select id="" name=""  className="border-2 w-50 h-10 p-1 rounded-lg cursor-pointer" onChange={(e)=>{setuserdata((prev)=>({...prev,showlike:e.target.value}))}}>
            <option value="true">True</option>
            <option value="false">False</option>
        </select>
          <label htmlFor="" className="text-2xl">Show saved blog:-</label>
        <select id="" name=""  className="border-2 w-50 h-10 p-1 rounded-lg cursor-pointer" onChange={(e)=>{setuserdata((prev)=>({...prev,showsave:e.target.value}))}}>
            <option value="true">True</option>
            <option value="false">False</option>
        </select>
      {/* Save Button */}
      <button
        type="submit"
        disabled={loading}
       className='border-2 p-1.5 w-fit rounded-2xl text-[14px] bg-black text-white font-bold cursor-pointer active:bg-gray-500'
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}

export default Editprofile
