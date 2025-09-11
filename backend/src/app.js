const express = require("express")
const app = express();
const cookieParser = require('cookie-parser')
const authRoutes = require("./routes/auth.route")

app.use(express.json())
app.use(cookieParser())
app.use("/auth",authRoutes)


module.exports = app