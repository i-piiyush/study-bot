const express = require("express")
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware")
const {chatController} = require("../controllers/chat.controller")

router.post("/",authMiddleware,chatController)

module.exports = router;