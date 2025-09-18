const express  = require("express")
const router = express.Router()
const {registerController,loginController, verifyController} = require("../controllers/auth.controller")

// user register

router.post("/register",registerController)
router.post("/login",loginController)
router.get("/verify-email",verifyController)


module.exports = router