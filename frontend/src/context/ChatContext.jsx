import { createContext, useContext, useEffect, useState } from "react"
import { authContext } from "./AuthContext"
import axios from "axios"
import toast from "react-hot-toast"

export const chatContext = createContext()

const ChatContext = ({ children }) => {
  const [messages, setmessages] = useState([])
  const [users, setusers] = useState([])
  const [selectedUser, setselectedUser] = useState(null)
  const [unseenMessages, setunseenMessages] = useState({})

  const { socket, url, authUser } = useContext(authContext)

  const getUser = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"))

      const res = await axios.get(`${url}/api/message/getUserSidebar`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      })

      setusers(res.data.filterUser)
      setunseenMessages(res.data.unseenMessages || {})
    } catch (err) {
      console.log(err.message)
    }
  }

const sendMessage = async (messageData) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.post(
      `${url}/api/message/send/${selectedUser._id}`,
      messageData,
      {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );
    setmessages((prev) => [...prev, res.data.userMessage]);

  } catch (err) {
    toast.error("Failed to send message");
  }
};

const sendImage = async(imageData) =>{
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.post(
      `${url}/api/message/sendImage/${selectedUser._id}`,
      imageData,
      {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );
    setmessages((prev) => [...prev, res.data.userMessage]);

  } catch (err) {
    toast.error("Failed to send message");
  }

}




  // 🔹 Get chat messages
  const getMessages = async (userId) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"))

      const res = await axios.get(`${url}/api/message/${userId}`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      })

      setmessages(res.data.messages)
    } catch (error) {
      console.log(error.message)
    }
  }

const subscribeToMessage = () => {
  if (!socket) return;

  socket.off("newMessage");

  socket.on("newMessage", (newMessage) => {
    const isRelevant = newMessage.senderId === authUser._id || newMessage.receiverId === authUser._id;
    if (!isRelevant) return;
    if (selectedUser && (newMessage.senderId === selectedUser._id || newMessage.senderId === authUser._id)) {
      setmessages((prev) => {
        if (prev.some(m => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    } 
    else {
      setunseenMessages((prev) => ({
        ...prev,
        [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
      }));
    }
  });
};




  useEffect(() => {
    subscribeToMessage()
    return () => socket?.off("newMessage")
  }, [socket, selectedUser])

  return (
    <chatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        getUser,
        sendMessage,
        setselectedUser,
        unseenMessages,
        setunseenMessages,
        getMessages,
        sendImage
      }}
    >
      {children}
    </chatContext.Provider>
  )
}

export default ChatContext
