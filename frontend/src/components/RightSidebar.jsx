import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { chatContext } from '../context/ChatContext'
import { authContext } from '../context/AuthContext'

const RightSidebar = ({ showRightSidebar, setShowRightSidebar }) => {
  const { selectedUser, messages } = useContext(chatContext)
  const { onlineUsers } = useContext(authContext)
  const [imageMsg, setImageMsg] = useState([])

  useEffect(() => {
    const imgs = messages.filter(m => m.image).map(m => m.image)
    setImageMsg(imgs)
  }, [messages])

  if (!selectedUser) return null

  return (
    <div
      className={` bg-[#0f0c29] md:bg-[#8185B2]/10  text-white fixed inset-0 z-50 ${showRightSidebar ? 'block' : 'hidden'} md:static md:z-auto md:block md:w-auto
      `}
    >
      {/* CLOSE BUTTON (MOBILE) */}
      <button
        className="absolute top-4 right-4 md:hidden text-2xl"
        onClick={() => setShowRightSidebar(false)}
      >
        ✕
      </button>

      <div className="overflow-y-scroll h-full pb-24 pt-16">
        <div className='flex flex-col items-center gap-2 text-xs font-light mx-auto'>
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            className='w-24 rounded-full'
            alt=""
          />

          <h1 className='text-2xl font-medium flex items-center gap-2'>
            {onlineUsers.includes(selectedUser._id) && (
              <span className='w-2 h-2 rounded-full bg-green-500'></span>
            )}
            {selectedUser.fullname}
          </h1>

          <p className='text-center px-10'>{selectedUser.bio}</p>
        </div>

        <hr className='border-[#ffffff50] my-6' />

        <div className='px-6 text-sm'>
          <p className='mb-2'>Media</p>
          <div className='grid grid-cols-3 gap-3 max-h-[300px] overflow-y-scroll'>
            {imageMsg.map((url, i) => (
              <img
                key={i}
                src={url}
                onClick={() => window.open(url)}
                className='rounded-lg cursor-pointer'
                alt=""
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightSidebar
