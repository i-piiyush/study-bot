const chatModel = require("../models/chat.model")
const userModel = require("../models/user.model")


const chatController = async (req,res)=>{
    try {

        const {title} = req.body;
        const user= req.user

        
       const chatTitle = await chatModel.create({
        user:user.id,
        title:title
       })

       res.status(201).json({
        message:"title created",
        chat_data:chatTitle
       })
        
        
        
    } catch (error) {
        console.log("error: ",error)
        return res.status(500).json({
            message:"server error"
        })
    }
}

module.exports = {
    chatController
}