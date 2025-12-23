import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import { authContext } from '../context/AuthContext'


const Mainroutes = () => {

  const {authUser} = useContext(authContext)
  
  

  

  return (
    <div>
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to='/'/>} />
        <Route path='/Profile-update' element={<Profile />}></Route>
      </Routes>
    </div>
  )
}

export default Mainroutes
