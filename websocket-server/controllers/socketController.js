const { findChannel } = require("../utils/findChannel.js");
const { messageQueue } = require("../queue/messageQueue.js");
const { webhookChannelQueue } = require("../queue/webhookChannelQueue.js");
const {
  removeUserFromChannel,
  getUsersInChannel,
} = require("../redis/channelCommands.js");

const handleConnection = (socket, ioServer) => {
  socket.on("subscribe", async (channel, callback) => {
    try {
      await socket.join(channel);
      const result = await Promise.all([
        findChannel(channel),
        getUsersInChannel(channel, socket.id),
      ]);

      const channelInfo = result[0];
      const usersInChannel = result[1];
      const channelId = channelInfo._id;
      const pastMessages = channelInfo
        ? channelInfo.messages.map((message) => message.content)
        : [];

      console.log(usersInChannel);
      if (typeof callback === "function") {
        callback({
          success: true,
          message: `Successfully subscribed to ${channel}`,
          pastMessages,
          channelId,
        });
      }
    } catch (error) {
      console.error(`Failed to subscribe to ${channel}:`, error);
      if (typeof callback === "function") {
        callback({
          success: false,
          message: `Failed to subscribe to ${channel}`,
        });
      }
    }
  });

  socket.on("unsubscribe", async (channel) => {
    try {
      await Promise.all([
        socket.leave(channel),
        removeUserFromChannel(channel, socket.id),
      ]);

      // ioServer.to(channel).emit("user-left", { socketId: socket.id });
    } catch (error) {
      console.error(`Failed to unsubscribe from ${channel}:`, error);
    }
  });

  socket.on("send message", async (channel, message, channelId) => {
    try {
      console.log(`Sending message to channel ${channel}:`, message);
      ioServer.to(channel).emit("new message", { channel, message });

      messageQueue.add("messages", { channel, message, channelId });
      webhookChannelQueue.add("webhookChannel", {
        channel,
        message,
        channelId,
      });
    } catch (error) {
      console.error(`Failed to send message to ${channel}:`, error);
    }
  });
};

module.exports = { handleConnection };
