const { findChannel } = require("../utils/findChannel.js");
const { messageQueue } = require("../queue/messageQueue.js");
const { webhookChannelQueue } = require("../queue/webhookChannelQueue.js");

const handleConnection = (socket, ioServer) => {
  socket.on("subscribe", async (channel, callback) => {
    try {
      await socket.join(channel);
      const result = await findChannel(channel);
      const channelId = result._id;

      const pastMessages = result
        ? result.messages.map((message) => message.content)
        : [];

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
      await socket.leave(channel);
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

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
};

module.exports = { handleConnection };
