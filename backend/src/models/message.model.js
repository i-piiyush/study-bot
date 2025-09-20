const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    chatId:{
        type:mongoose.Types.ObjectId,
        ref:"chat",
        required:true
    },
    content:{
        type:String,
        require:true,

    },
    role:{
        type:String,
        enum:["user","model"],
        default:"user"
    }
})

const messageModel = mongoose.model("message",messageSchema)

module.exports = messageModel