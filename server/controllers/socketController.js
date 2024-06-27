const handleConnection = (socket, ioServer) => {
  socket.on("subscribe", async (channel, callback) => {
    try {
      await socket.join(channel);
      if (typeof callback === "function") {
        callback({
          success: true,
          message: `Successfully subscribed to ${channel}`,
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

  socket.on("send message", (channel, message) => {
    try {
      console.log(`Sending message to channel ${channel}:`, message);
      ioServer.to(channel).emit("new message", { channel, message });
    } catch (error) {
      console.error(`Failed to send message to ${channel}:`, error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
};

module.exports = { handleConnection };
