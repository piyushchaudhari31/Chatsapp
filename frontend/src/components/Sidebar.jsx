import React, { useEffect, useState, useContext } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { authContext } from '../context/AuthContext';
import { chatContext } from '../context/ChatContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { url, socket, setToken, setAuthuser, onlineUsers } = useContext(authContext);
  const { getUser, selectedUser, users, setselectedUser, unseenMessages, setunseenMessages } = useContext(chatContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [input, setInput] = useState("");

  
  

  // Filter users by search input
  const filterData = input
    ? users.filter((user) => user.fullname.toLowerCase().includes(input.toLowerCase()))
    : users;

  useEffect(() => {
    getUser();
  }, []);

  const logOut = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      return toast.promise(
        axios.get(`${url}/api/auth/log-out`, {
          withCredentials: true,
          headers: { Authorization: token ? `Bearer ${token}` : undefined }
        }),
        {
          loading: "Logging out...",
          success: (res) => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setAuthuser(null);
            if (socket && socket.connected) socket.disconnect();
            navigate("/login");
            return res.data?.message || "Logged out successfully";
          },
          error: (err) => err.response?.data?.message || "Something went wrong",
        }
      );
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-  xl overflow-y-scroll text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
      {/* Header */}
      <div className="pb-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={assets.talking} alt="" className="max-w-10" />
          <p className="font-semibold">BruhChat</p>
        </div>

        {/* Menu */}
        <div className="relative">
          <img src={assets.menu_icon} alt="" className="max-w-5 cursor-pointer" onClick={() => setMenuOpen(prev => !prev)} />
          {menuOpen && (
            <div className="absolute top-full right-0 z-20 w-32 p-4 mt-2 rounded-md bg-[#282142] border border-gray-600 text-gray-100">
              <p className="cursor-pointer text-sm hover:text-violet-400" onClick={() => { navigate('/Profile-update'); setMenuOpen(false); }}>Edit Profile</p>
              <hr className="my-2 border-t border-gray-500" />
              <p className="cursor-pointer text-sm hover:text-red-400" onClick={() => { logOut(); setMenuOpen(false); }}>Log-Out</p>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="flex bg-[#282142] rounded-xl items-center gap-2 py-3 px-4 mt-1">
        <img src={assets.search_icon} alt="" className="w-3" />
        <input type="text" placeholder="Search user..." className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
          value={input} onChange={(e) => setInput(e.target.value)} />
      </div>

      {/* Users */}
      <div className="flex flex-col mt-5">
        {filterData.map((item) => (
          <div key={item._id} onClick={() => {
            setselectedUser(item)
            setunseenMessages(prev => ({...prev,[item._id]: 0}))
            }} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === item._id ? 'bg-[#282142]/50' : ''}`}>
            <img src={item?.profilePic || assets.avatar_icon} alt="" className="w-[35px] aspect-[1/1] rounded-full" />
            <div className="flex flex-col leading-5">
              <p>{item.fullname}</p>
              {onlineUsers.includes(String(item._id)) ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>

            {unseenMessages[String(item._id)] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {unseenMessages[String(item._id)]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
