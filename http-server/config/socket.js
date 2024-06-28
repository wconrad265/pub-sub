const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-streams-adapter");
const { redisClient } = require("./redis");

const ioServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
    },
  });

  io.adapter(createAdapter(redisClient));
  return io;
};

module.exports = { ioServer };
