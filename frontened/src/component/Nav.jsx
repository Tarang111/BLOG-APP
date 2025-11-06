import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaPenAlt, FaUserCircle } from "react-icons/fa"; // Added FaUserCircle
import { CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../utilis/userSlice';
import { useEffect } from 'react';

function Nav() {
  // Access the token from the Redux store
  const { token } = useSelector(slice => slice.user);

  const [search,setsearch]=useState("")
  const { profilePic ,username,id} = useSelector(slice => slice.user)
  const [showmenu, setshowmenu] = useState(false)
  const dispatch=useDispatch()
  const [searchpop,setsearchpop]=useState(false)
  const navigate=useNavigate()
  function searchpopup()
  {
   setsearchpop(prev=>!prev)
  }
  return (
    <>
      {/* Navigation Bar - Fixed at top, better styling */}
      <nav className='sticky top-0  w-full h-[70px] bg-white border-b shadow-sm  flex justify-center items-center'>

        {/* Main Content Container - Max width for better design */}
        <div className="w-[95%] max-w-7xl mx-auto flex justify-between items-center px-4">

          {/* Logo & Search Section */}
          <div className="flex items-center gap-6">

            {/* Logo - Simplified from original SVG */}
            <Link to={"/"}   className="text-2xl font-bold text-gray-800 flex items-center">
              <svg  width="67" height="41" viewBox="0 0 67 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M45.0353 4.66312C45.8331 3.77669 46.7195 3.04539 47.6281 2.46921C49.2236 1.47198 50.9079 0.940125 52.6364 0.940125V15.411C51.3732 11.0232 48.6475 7.25591 45.0353 4.66312ZM66.5533 40.9401H15.2957C6.87461 40.9401 0.0712891 34.1146 0.0712891 25.7157C0.0712891 17.6714 6.3206 11.0675 14.232 10.5135V0.940125C16.0048 0.940125 17.7555 1.44982 19.3954 2.46921C20.304 3.02323 21.1904 3.75453 21.9882 4.59663C25.2458 2.31409 29.1904 0.984446 33.4674 0.984446C33.4674 10.2254 30.1433 20.9734 19.3289 20.9955H33.3566C32.9577 19.2005 31.3178 17.8709 29.3677 17.8487H37.5228C35.5727 17.8487 33.9328 19.2005 33.5339 21.0177H46.6087C49.2236 21.0177 51.8164 21.5274 54.2541 22.5468C56.6696 23.544 58.8857 25.0288 60.725 26.8681C62.5865 28.7296 64.0491 30.9235 65.0464 33.339C66.0436 35.7324 66.5533 38.3252 66.5533 40.9401ZM22.8525 10.7795C23.1849 11.6437 24.0713 12.6188 25.3123 13.3279C26.5533 14.0371 27.8386 14.3252 28.7472 14.1922C28.4148 13.3279 27.5284 12.3529 26.2874 11.6437C25.0464 10.9346 23.761 10.6465 22.8525 10.7795ZM41.5117 13.3279C40.2707 14.0371 38.9854 14.3252 38.0768 14.1922C38.4092 13.3279 39.2957 12.3529 40.5367 11.6437C41.7777 10.9346 43.063 10.6465 43.9716 10.7795C43.6613 11.6437 42.7527 12.6188 41.5117 13.3279Z" fill="#283841"></path>
              </svg>
            </Link>

            {/* Search Bar - Hidden on small screens for better responsiveness */}
            <div className='hidden sm:flex border border-gray-300 bg-gray-50 p-2 rounded-full items-center gap-2'>
             <Link to={`/search/${search.trim()}`}> <CiSearch className='text-xl text-gray-500 ml-1' /></Link>
              <input
                type="search"
                placeholder='Search...'
           
                className='focus:outline-none bg-transparent text-sm w-40 md:w-64'
                onChange={(e)=>{setsearch(e.target.value) }}
              />
            </div>
           
             <CiSearch className='text-3xl flex md:hidden' onClick={()=>{searchpopup()}}/>

              {searchpop&& <div className=' flex border absolute top-12 left-5 w-[90%] border-gray-300 bg-gray-50 p-2 rounded-full items-center gap-2'>
             <Link to={`/search/${search.trim()}`}> <CiSearch className='text-xl text-gray-500 ml-1' /></Link>
              <input
                type="search"
                placeholder='Search...'
           
                className='focus:outline-none bg-transparent text-sm w-40 md:w-64'
                onChange={(e)=>{setsearch(e.target.value) }}
              />
            </div>}

          </div>

          {/* Right Side: Write and Auth/Profile */}
          <div className="flex items-center space-x-4">

            {/* Write Link - Always visible for quick access (if logged in, the link destination should be protected) */}
            <Link
              to={token ? "/addblog" : "/signin"}
              className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition duration-150"
            >
              <FaPenAlt className="text-lg" />
              <p className="hidden sm:block text-sm">Write</p>
            </Link>

            {/* Conditional Authentication/Profile Links */}
            {token ? (
              // User is logged in
              <div
                className="cursor-pointer w-10 h-10 rounded-full flex justify-center items-center  overflow-hidden"
                onClick={() => setshowmenu((prev) => !prev)}
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                     referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FaUserCircle className="text-3xl text-gray-600 hover:text-blue-500 transition duration-150" />
                )}
              </div>

            ) : (
              // User is logged out
              <div className="flex items-center gap-3">
                <Link
                  to={"/signin"}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition duration-150"
                >
                  Sign In
                </Link>
                <Link
                  to={"/signup"}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-full hover:bg-green-800 transition duration-150"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {showmenu && <div className="border-2 w-[150px] h-fit p-2  text-black absolute top-15 right-10  rounded-lg z-50">
   <Link to={`/profile/${username}`}><p className='p-1 border bg-black text-white text-center rounded-lg font-bold cursor-pointer' onClick={() => setshowmenu((prev) => !prev)}>Profile</p></Link>
          <Link to={`/editprofile/${id}`} > <p className='p-1 border bg-black text-white text-center rounded-lg font-bold cursor-pointer' onClick={() => setshowmenu((prev) => !prev)}>Edit Profile</p></Link>
         <p  onClick={()=>{dispatch(logout(),  navigate("signin") ,setshowmenu((prev=>!prev)))}} className='p-1 border bg-black text-white text-center rounded-lg font-bold  cursor-pointer'>Logout</p>
        </div>}
      </nav>
      {/* Outlet for rendering nested routes */}
      <Outlet />
    </>
  );
}

export default Nav;