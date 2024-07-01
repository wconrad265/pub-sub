class RedisOperations {
  constructor(redisClient) {
    this.redisClient = redisClient
  }

  async setUserSocket(socketId, user) {
    return this.redisClient.hset(`socketId:${socketId}`, "user", user);
  }

  async addConnectedUser(socketId) {
    return this.redisClient.sadd("connectedUsers", `socketId:${socketId}`);
  }

  async addUserToChannel(socketId, channel) {
    return this.redisClient.sadd(`channel:${channel}`, socketId)
  }

  async addChannelToUser(socketId, channel) {
    return this.redisClient.sadd(`user:${socketId}:channels`, channel)
  }

  async getChannelMembers(channel) {
    return this.redisClient.smembers(`channel:${channel}`)
  }

  async getUserSocketInformationFromChannel(socketId) {
    return this.redisClient.hget(`socketId:${socketId}`, "user");
  }

  async removeUserFromChannelSet(socketId, channel ) {
    return this.redisClient.srem(`channel:${channel}`, socketId);
  }

  async removeChannelFromUserSet(socketId, channel) {
    return this.redisClient.srem(`user:${socketId}:channels`, channel);
  }

  async getUserChannels(socketId) {
    return this.redisClient.smembers(`user:${socketId}:channels`);
  }

  async removeChannelFromUserSet(socketId, channel) {
    return this.redisClient.srem(`user:${socketId}:channels`, channel);
  }

  async getUserChannels(socketId) {
    return this.redisClient.smembers(`user:${socketId}:channels`);
  }

  async removeUserFromConnectedUsers(socketId) {
    return this.redisClient.srem("connectedUsers", `socketId:${socketId}`);
  }

  async deleteUserSocketData(socketId) {
    return this.redisClient.del(`socketId:${socketId}`);
  }

  async deleteUserChannelsData(socketId) {
    return this.redisClient.del(`user:${socketId}:channels`);
  }

}

module.export = RedisOperations