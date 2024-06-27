const { addChannel } = require("../utils/addChannel");
const { messageQueue } = require("../queue/queue.js");

const handleConnection = (socket, ioServer) => {
  socket.on("subscribe", async (channel, callback) => {
    try {
      const result = await Promise.all([
        socket.join(channel),
        addChannel(channel),
      ]);
      if (typeof callback === "function") {
        callback({
          success: true,
          message: `Successfully subscribed to ${channel}`,
          pastMessages: result[1].messages.map((message) => message.content),
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

  socket.on("send message", async (channel, message) => {
    try {
      console.log(`Sending message to channel ${channel}:`, message);
      ioServer.to(channel).emit("new message", { channel, message });

      messageQueue.add("messages", { channel, message });
    } catch (error) {
      console.error(`Failed to send message to ${channel}:`, error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
};

module.exports = { handleConnection };
