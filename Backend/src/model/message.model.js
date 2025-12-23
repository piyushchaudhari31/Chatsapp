const mongoose = require('mongoose');

const mongooseSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true 
    },
    text:{
        type:String,
    },
    image:{
        type:String,
    },
    seen:{type:Boolean ,default:false}
},{timestamps:true})

const messageModel = mongoose.model('message',mongooseSchema)

module.exports = messageModel

