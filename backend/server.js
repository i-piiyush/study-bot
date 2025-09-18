require("dotenv").config()
const app = require("./src/app");
const connectToDB = require("./src/db/db")
const initSocketServer = require("./src/socket/socket.server")
const httpServer = require("http").createServer(app)


initSocketServer(httpServer)
connectToDB()


httpServer.listen("3000", () => {
  console.log("server is running on port 3000");
});
