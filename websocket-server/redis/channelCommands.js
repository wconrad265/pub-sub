const redisClient = require("./client");

const addUserToChannel = async (channel, socketId) => {
  await Promise.all([
    redisClient.sadd(`channel:${channel}`, socketId),
    redisClient.sadd(`user:${socketId}:channels`, channel),
  ]);
};

const getUsersInChannel = async (channel, socketId) => {
  await addUserToChannel(channel, socketId);

  const socketIds = await redisClient.smembers(`channel:${channel}`);

  const userFetchPromises = socketIds.map(async (socketId) => {
    const user = await redisClient.hget(`socketId:${socketId}`, "user");
    return { user, socketId };
  });

  const users = await Promise.all(userFetchPromises);

  return users;
};

const removeUserFromChannel = async (channel, socketId) => {
  const channelName = channel.name;
  try {
    await Promise.all([
      redisClient.srem(`channel:${channelName}`, socketId),
      redisClient.srem(`user:${socketId}:channels`, channelName),
    ]);
    console.log(`Removed socket ID ${socketId} from channel ${channelName}`);
    console.log(`Removed channel ${channelName} from socketId ${socketId}`);
  } catch (err) {
    console.error(
      `Error removing socket ID ${socketId} from channel ${channelName}:`,
      err
    );
  }
};

module.exports = { addUserToChannel, getUsersInChannel, removeUserFromChannel };
