const { handleConnection } = require("../controllers/socketController");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");

const createSocketServer = (pubClient, subClient) => {
  const httpServer = createServer();

  const ioServer = new Server(httpServer, {
    transports: ["websocket", "polling"],
    cors: {
      origin: "*",
    },
  });

  ioServer.adapter(createAdapter(pubClient, subClient));

  ioServer.on("connection", (socket) => {
    handleConnection(socket, ioServer);
    console.log("connected");
  });

  return ioServer;
};

module.exports = { createSocketServer };
