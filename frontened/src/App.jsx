import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './component/Home'
import './App.css'
import Authform from './pages/Authform'
import Nav from './component/Nav'
import Addblog from './pages/Addblog'
import Blogpage from './pages/Blogpage'
import Editblog from './pages/Editblog'
import VerifyUser from './component/VerifyUser'
import Profile from './component/Profile'
import Editprofile from './component/Editprofile'
import Searchpage from './component/Searchpage'

function App() {
  return (
    <div className=" w-screen min-h-screen overflow-x-hidden ">
       <Routes>
       <Route path="/" element={<Nav/>}>
            <Route path='/' element={<Home/>}></Route>
           <Route path='/signin' element={<Authform type={"signin"}/>}></Route>
           <Route path='/signup' element={<Authform type={"signup"}/>}></Route>
            <Route path='/addblog' element={<Addblog/>}></Route>
            <Route path='/blog/:blogId' element={<Blogpage/>}></Route>
             <Route path='/edit/:id' element={<Editblog/>}></Route>
             <Route path='/verifyemail/:token' element={<VerifyUser/>}></Route>
             <Route path='/profile/:username' element={<Profile/>}></Route>
             <Route path='/editprofile/:username' element={<Editprofile/>}></Route>
              <Route path='/search/:keyword' element={<Searchpage/>}></Route>
       </Route>
       </Routes>
    </div>
  )
}

export default App