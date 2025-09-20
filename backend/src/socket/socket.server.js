const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const genrateAiResponse = require("../services/ai.service");
const messageModel = require("../models/message.model");

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
      next();
    } catch (error) {
      next(new Error("invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      const { content } = messagePayload;

      await messageModel.create({
        user: socket.user._id,
        chatId: messagePayload.chatId,
        content: content,
      });

      const chatHistory = await messageModel.find({
        chatId: messagePayload.chatId,
      });

      const res = await genrateAiResponse(
        chatHistory.map((elem) => {
          return {
            role: elem.role,
            parts: [{ text: elem.content }],
          };
        })
      );

      socket.emit("ai-response", {
        chatId: messagePayload.chatId,
        content: res,
      });
      const user = await userModel.findById(socket.user._id);
      if (res.strike_count > 0) {
        user.strikes++;

        if (user.strikes === 3) {
          user.isBanned = true;
        }

        user.save();
      }

      await messageModel.create({
        user: socket.user._id,
        chatId: messagePayload.chatId,
        content: res.content,
        role: "model",
      });
    });
  });
};

module.exports = initSocketServer;
