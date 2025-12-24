require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/db/db");
const { Server } = require("socket.io");
const http = require("http");

connectToDB();

const userSocketmap = {};

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;

  if (!userId) {
    console.log("Socket connected without userId");
    return;
  }

  userSocketmap[userId] = socket.id;

  io.emit("getOnlineUser", Object.keys(userSocketmap));

  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketId = userSocketmap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId });
    }
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSocketId = userSocketmap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { senderId });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected ===>", userId);
    delete userSocketmap[userId];
    io.emit("getOnlineUser", Object.keys(userSocketmap));
  });
});

server.listen(3000, () => {
  console.log("Server + Socket.IO running on port 3000");
});

module.exports = { io, userSocketmap };
