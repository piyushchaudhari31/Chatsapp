import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const authContext = createContext(null);

const AuthContext = ({ children }) => {
  const url = "http://localhost:3000";

  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  const [authUser, setAuthuser] = useState(JSON.parse(localStorage.getItem("user")));
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!authUser) return;

    const newSocket = io(url, {
      query: { userId: authUser._id },
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUser", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [authUser]);

  return (
    <authContext.Provider
      value={{
        url,
        token,
        setToken,
        authUser,
        setAuthuser,
        onlineUsers,
        socket,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthContext;
