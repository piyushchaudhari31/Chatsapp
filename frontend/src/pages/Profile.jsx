import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { useForm } from 'react-hook-form'
import { authContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import axios from 'axios'

const Profile = () => {
  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()

  const { register, handleSubmit } = useForm()
  const { url, setAuthuser, authUser } = useContext(authContext)

  const user = JSON.parse(localStorage.getItem("user"))

  const submitHandler = async (data) => {
    try {
      const formData = new FormData()
      formData.append("fullname", data.fullname)
      formData.append("bio", data.bio)

      if (selectedImg) {
        formData.append("profilePic", selectedImg)
      }

      const token = JSON.parse(localStorage.getItem("token"))

      toast.promise(
        axios.patch(
          `${url}/api/auth/update-profile/${user._id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        ),
        {
          loading: "Updating profile...",
          success: (res) => {
            setAuthuser(res.data.updateData)
            localStorage.setItem(
              "user",
              JSON.stringify(res.data.updateData)
            )
            navigate('/')
            return res.data.message
          },
          error: (err) =>
            err.response?.data?.message || "Something went wrong",
        }
      )
    } catch (error) {
      console.log("Frontend Error:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">

        <form className="flex flex-col gap-5 p-10 flex-1" onSubmit={handleSubmit(submitHandler)}>
        <h3 className="text-lg">Profile details</h3>

          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input type="file" id="avatar" accept=".png,.jpg,.jpeg" hidden onChange={(e) => setSelectedImg(e.target.files[0])}/>

            <img src={selectedImg? URL.createObjectURL(selectedImg): authUser?.profilePic || assets.avatar_icon} alt="avatar" className="w-12 h-12 rounded-full object-cover"/>Upload Profile Image</label>

          <input {...register("fullname")} defaultValue={authUser?.fullname} type="text" placeholder="Your Name" required className="p-2 border border-gray-500 rounded-md outline-none focus:ring-1" />

          
          <textarea {...register("bio")} defaultValue={authUser?.bio} rows={4} placeholder="Write something about you..." required className="p-2 border border-gray-500 rounded-md outline-none focus:ring-1"/>

          <button className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg"> Save </button>
        </form>
        <img className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 object-cover" src={authUser?.profilePic || assets.talking}alt="profile"/>
      </div>
    </div>
  )
}

export default Profile
