const redisClient = require("./client");

const addUser = async (user, socketId) => {
  try {
    await Promise.all([
      redisClient.hset(`socketId:${socketId}`, "user", user),
      redisClient.sadd("connectedUsers", `socketId:${socketId}`),
    ]);

    console.log(`Added socket ID ${socketId} with ${user}`);
  } catch (err) {
    console.error(`Error adding socket ID ${socketId} to with ${user}`, err);
  }
};

const removeUser = async (socketId, ioServer) => {
  /*
    loop through user:${socketId}:channels, and remove him from every channel,
    remove from connectedUsers
    remove him from redis
  */

  const channelsSubscribed = await redisClient.smembers(
    `user:${socketId}:channels`
  );

  const removeChannelsPromises = channelsSubscribed.map(async (channel) => {
    await redisClient.srem(`channel:${channel}`, socketId);
    ioServer.to(channel).emit("user leave", { socketId });
  });

  const operations = [
    ...removeChannelsPromises,
    redisClient.srem("connectedUsers", `socketId:${socketId}`),
    redisClient.del(`socketId:${socketId}`),
  ];
  Promise.all(operations);

  console.log("user removed");
};

module.exports = { addUser, removeUser };
