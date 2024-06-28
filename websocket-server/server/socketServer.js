const { handleConnection } = require("../controllers/socketController");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-streams-adapter");

const createSocketServer = (redisClient) => {
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
    console.log("connected");
  });

  ioServer.on("reconnection", (socket) => {
    console.log("recovered");
  });

  return ioServer;
};

module.exports = { createSocketServer };
