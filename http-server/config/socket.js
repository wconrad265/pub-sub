const { Emitter } = require("@socket.io/redis-emitter");
const { redisClient } = require("./redis");

let emitterInstance;

const createIoEmitter = () => {
  const emitter = new Emitter(redisClient);

  emitterInstance = emitter;

  return emitter;
};

const getEmitterInstance = () => {
  if (!emitterInstance) {
    throw new Error("Socket.io instance has not been initialized.");
  }
  return emitterInstance;
};

module.exports = { createIoEmitter, getEmitterInstance };
