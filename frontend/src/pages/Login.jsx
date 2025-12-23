import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import {useForm} from 'react-hook-form'
import { authContext } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'


const Login = () => {

  const [currentState, setcurrentState] = useState("Sign up")
  const {setAuthuser , authUser ,url} = useContext(authContext)

  const navigate = useNavigate()
 
  const {register , handleSubmit ,reset} = useForm()
  

  const submitHandler= async(data)=>{

    if(currentState === "Sign up"){
      try {
        return toast.promise(
          axios.post(`${url}/api/auth/register`,data,{withCredentials:true}),
          {
            loading:"create User..",
            success:(res)=>{
              navigate('/')
              localStorage.setItem("user",JSON.stringify(res.data.user))
              localStorage.setItem("token",JSON.stringify(res.data.token))
              setAuthuser(res.data.user)
              return res.data.message
            },
            error:(err)=>err.response.data.message || "Something Went Wrong"
          }

        )
      } catch (error) {
        console.log(error.message); 
      }
    }
    else{
      try {
        return toast.promise(
          axios.post(`${url}/api/auth/login`,data,{withCredentials:true}),
          {
            loading:"loading User..",
            success:(res)=>{
              navigate('/')
              localStorage.setItem("user",JSON.stringify(res.data.EmailExist))
              localStorage.setItem("token",JSON.stringify(res.data.token))
              setAuthuser(res.data.EmailExist)
              
              return res.data.message
            },
            error:(err)=>err.response.data.message || "Something Went Wrong"
          }

        )
      } catch (error) {
        console.log(error.message); 
      }
    }
  }



  

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl '>
      <img src={assets.talking} alt="" className='w-[350px]' />



      <form className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg' onSubmit={handleSubmit(submitHandler)}>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currentState}
        </h2>
        {currentState === "Sign up" &&(
          <input type="text" {...register("fullname")} className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required />
        )}
          <>
            <input {...register("email")} type='email' placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none ' />
            <input {...register("password")} type='Password' placeholder='Enter Password' required className='p-2 border border-gray-500 rounded-md focus:coutline-none' />

          </>
        
        {
          currentState === "Sign up" &&(
            <textarea rows={4} {...register("bio")} className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='provide a short bio...'  required></textarea>
          )
        }

          <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>{currentState === "Sign up" ? "Create Account" : "Login now"}</button>

          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <input type="checkbox" required/>
            <p>Agree to the term of use & privacy Policy</p>
          </div>

          <div className='flex felx-col gap-2'>
            {currentState === "Sign up" ? (
              <p className='text-sm text-gray-600'>Already have an account? <span onClick={()=>setcurrentState("Login")} className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
            ):(
              <p className='text-sm text-gray-600'>Create an Account <span onClick={()=>setcurrentState("Sign up")} className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
            )}


          </div>
      </form>

    </div>
  )
}

export default Login
