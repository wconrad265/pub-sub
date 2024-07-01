
const RedisOperations = module.require("./redisOperations.js")

class PresenceManager {
  constructor(socketId, user, ioServer) {
    this.redisOps = RedisOperations;
    this.socketId = socketId
    this.user = user
    this.ioServer = ioServer
  }

  async addUser() {
    try {
      await Promise.all([
        this.setUserSocket(this.socketId, this.user),
        this.addConnectedUser(this.socketId),
      ]);
  
      console.log(`Added socket ID ${socketId} with ${user}`);
    } catch (err) {
      console.error(`Error adding socket ID ${socketId} to with ${user}`, err);
    }
  }

  async removeUser() {
    try {
      const channelsSubscribed = await this.redisOps.getUserChannels(this.socketId)

      const removeChannelsPromises = channelsSubscribed.map(async (channel) => {
        await this.redisOps.removeUserFromChannelSet(this.socketId, channel);
        this.ioServer.to(channel).emit("user leave", { socketId: this.socketId });
      });

      const operations = [
        ...removeChannelsPromises,
        this.redisOps.srem("connectedUsers", `socketId:${this.socketId}`),
        this.redisOps.del(`socketId:${this.socketId}`),
        this.redisOps.del(`user:${this.socketId}:channels`),
      ];
      await Promise.all(operations);

      console.log("User removed");
    } catch (err) {
      console.error(`Error removing socket ID ${this.socketId}`, err);
    }
  }

  async addUserToChannel(channel) {
    await Promise.all([
      this.addUserToChannel(channel),
      this.addChannelToUser(channel)
    ]);
  };

  async getUsersInChannel(channel) {
    const socketIds = await this.getChannelMembers(channel)

    const userFetchPromises = socketIds.map(async (socketId) => {
      const user = await this.getUserSocketInformationFromChannel(socketId)
      return { user, socketId };
    });
  
    const users = await Promise.all(userFetchPromises);
  
    return users;
  }

  async removeUserFromChannel(channel) {
    try {
      await Promise.all([
        this.removeUserFromChannelSet(channel, this.socketId),
        this.removeChannelFromUserSet(this.socketId, channel),
      ]);
      console.log(`Removed socket ID ${this.socketId} from channel ${channel}`);
      console.log(`Removed channel ${channel} from socketId ${this.socketId}`);
    } catch (err) {
      console.error(
        `Error removing socket ID ${this.socketId} from channel ${channel}:`,
        err
      );
    }
  }

  async removeUser() {
    try {
      const channelsSubscribed = await this.getUserChannels(this.socketId);

      const removeChannelsPromises = channelsSubscribed.map(async (channel) => {
        await this.removeUserFromChannelSet(channel, this.socketId);
        this.ioServer.to(channel).emit("user leave", { socketId: this.socketId });
      });

      const operations = [
        ...removeChannelsPromises,
        this.removeUserFromConnectedUsers(this.socketId),
        this.deleteUserSocketData(this.socketId),
        this.deleteUserChannelsData(this.socketId),
      ];
      await Promise.all(operations);

      console.log("User removed");
    } catch (err) {
      console.error(`Error removing socket ID ${this.socketId}`, err);
    }
  }

}