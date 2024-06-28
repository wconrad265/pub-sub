const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-streams-adapter");
const { redisClient } = require("./redis");
const { createServer } = require("http");

let ioInstance;

const ioServer = () => {
  const httpServer = createServer();

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
    },
  });

  io.adapter(createAdapter(redisClient));

  io.on("connection", (socket) => {
    socket.on("*", (data) => {
      console.lot(`Received message from channel: ${data.channel}`);
    });
    console.log("connected");
  });

  ioInstance = io;

  return io;
};

const getIoInstance = () => {
  if (!ioInstance) {
    throw new Error("Socket.io instance has not been initialized.");
  }
  return ioInstance;
};

module.exports = { ioServer, getIoInstance };
