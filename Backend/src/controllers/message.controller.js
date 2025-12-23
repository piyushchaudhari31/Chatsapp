const messageModel = require("../model/message.model");
const userModel = require("../model/user.model");
const {io ,userSocketmap} = require('../../server');
const uploadfile = require("../services/Storage.service");
const {v4: uuidv4} = require('uuid')

async function getUserForSidebar(req,res){
    try {


        const userId = req.user._id; //---> jo login hai wo user

        const filterUser = await userModel.find({_id:{$ne:userId}}).select("-password"); 

        
        const unSeenMessage = {}
        const promises = filterUser.map(async(user)=>{
            const message = await messageModel.find({senderId:user._id , receiverId:userId , seen:false});
            if(message.length>0){
                unSeenMessage[user._id] = message.length
            }
        })
        await Promise.all(promises)

        res.status(200).json({
            message:"user Fatch Successfully",
            filterUser
        })

        
    } catch (error) {
        console.log(error.message);
        
        
    }
}

async function getUserMessage(req,res){

    try {
        const {userId} = req.params
        const myId = req.user._id

        const messages = await messageModel.find({
            $or:[
                {senderId:userId , receiverId:myId},
                {senderId:myId , receiverId:userId},
            ]
        })

        await messageModel.updateMany({senderId:userId,receiverId:myId},{seen:true})

        res.status(200).json({
            success:true,
            messages
        })
        
    } catch (error) {
        console.log(error.message);
        
        
    }

}

async function getMessageAsSeen(req,res){
    try {
        const {id} = req.params

        await messageModel.findByIdAndUpdate(id,{seen:true})
        res.status(200).json({
            success:true
        })

    } catch (error) {
        console.log(error.message);
        
        
    }
}





async function sendMessage(req, res) {
  try {
    const { text } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

   

    const userMessage = await messageModel.create({
      text,
      senderId,
      receiverId,
     
    });
    const { io, userSocketmap } = require("../../server"); 
    const receiverSocketId = userSocketmap?.[receiverId.toString()];
    console.log("Receiver ID:", receiverId);
    console.log("Socket Map:", userSocketmap);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", userMessage);
      console.log("Socket emitted to:", receiverSocketId);
    }

    res.status(201).json({
      success: true,
      userMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage:", error.message);
    res.status(500).json({ success: false });
  }
}

async function sendImage(req, res) {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const uploadImage = await uploadfile(req.file.buffer, `${uuidv4()}`); 

    const userMessage = await messageModel.create({
      senderId,
      receiverId,
      image: uploadImage.url,
    });

    const { io, userSocketmap } = require("../../server"); 
    const receiverSocketId = userSocketmap?.[receiverId.toString()];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", userMessage);
    }

    res.status(201).json({ success: true, userMessage });
  } catch (error) {
    console.log("Error in sendImage:", error.message);
    res.status(500).json({ success: false });
  }
}


module.exports = { getUserForSidebar, getUserMessage, getMessageAsSeen, sendMessage ,sendImage};





