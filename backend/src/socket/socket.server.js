const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      next(new Error("Unauthorised access"));
    }

    try {

      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      socket.user = user;
      next()

    } catch (error) {
      next(new Error("invalid token"));
    }
  });

  io.on("connect", (socket) => {
    console.log("new user connected", socket.id);
  });
};

module.exports = initSocketServer;
