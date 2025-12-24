import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../utils/util'
import { chatContext } from '../context/ChatContext'
import { authContext } from '../context/AuthContext'
import toast from 'react-hot-toast'



const ChatContainer = ({ setShowRightSidebar }) => {

  const scrollend = useRef()
  const typingTimeoutRef = useRef(null);

  const { messages, selectedUser, setselectedUser, sendMessage, getMessages, sendImage, typingUser } = useContext(chatContext)
  const { authUser, onlineUsers, socket } = useContext(authContext)

  const [input, setInput] = useState('');



  // handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    socket.emit("stopTyping", {
      senderId: authUser._id,
      receiverId: selectedUser._id,
    });

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    await sendImage(formData);

    // Reset file input
    e.target.value = "";
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!value.trim()) {
      socket.emit("stopTyping", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      });
      return;
    }

    socket.emit("typing", {
      senderId: authUser._id,
      receiverId: selectedUser._id,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      });
    }, 1000);
  };





  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser])

  useEffect(() => {
    if (scrollend.current && messages) {
      scrollend.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg '>
      {/* Header  */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.talking} alt="" className='w-10 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2' onClick={() => setShowRightSidebar(true)}>{selectedUser.fullname}
          {onlineUsers.includes(selectedUser._id) && (

            <span className='w-2 h-2 rounded-full bg-green-500'></span>
          )}
        </p>
        <img src={assets.arrow_icon} alt="" className='md:hidden max-w-7' onClick={() => setselectedUser(null)} />
        <img src={assets.help_icon} alt="" className='md:hidden max-w-5' />
      </div>

      {/* chat-Area  */}
      <div className='flex flex-col h-[calc(95%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg, idx) => {
          return (
            <div key={idx} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
              {msg.image ? (
                <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
              ) : (
                <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-5 break-words whitespace-pre-wrap  bg-violet-500/30 text-white ${msg.senderId === authUser._id ? "rounded-br-none " : "rounded-bl-none"}`}>{msg.text}</p>
              )}
              <div className='text-center text-xs'>
                <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full' />
                <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>

              </div>
            </div>
          )

        })}
        {typingUser && (
          <p className="text-xs mt-1 text-gray-400 ml-3 mb-2">
            Typing...
          </p>
        )}

        <div ref={scrollend}></div>

      </div>
      {/*---bottom -area */}
      <div className='absolute bottom-0 z-40 left-0 right-0 flex items-center gap-3 p-3 z-20'>
        <div className='flex-1 flex  items-center bg-gray-100/12 px-3 rounded-full'>
          <input onChange={handleTyping} value={input} onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder='send Message' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' />
          <input type="file" id='image' onChange={handleSendImage} accept='image/png , image/jpeg' hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} className='w-4 mr-2 cursor-pointer' alt="" />
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} className='w-7 cursor-pointer' alt="" />
      </div>





    </div>
  ) : <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
    <img src={assets.talking} className='max-w-15' alt="" />
    <p className='text-lg font-medium text-white'>Bat karo re , rooth ne se kya hoga</p>

  </div>
}

export default ChatContainer
