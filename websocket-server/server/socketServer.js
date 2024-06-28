const { handleConnection } = require("../controllers/socketController");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-streams-adapter");
const redisClient = require("../redis/client");
const { addUser, removeUser } = require("../redis/userCommands");

const createSocketServer = () => {
  const httpServer = createServer();

  const ioServer = new Server(httpServer, {
    cors: {
      origin: "*",
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
    },
  });

  ioServer.adapter(createAdapter(redisClient));

  ioServer.on("connection", (socket) => {
    handleConnection(socket, ioServer);

    socket.on("user", (user) => addUser(user, socket.id));

    socket.on("disconnect", () => {
      removeUser(socket.id, ioServer);
      console.log("Client disconnected");
    });
  });

  ioServer.on("reconnection", (socket) => {
    console.log("recovered");
  });

  return ioServer;
};

module.exports = { createSocketServer };
