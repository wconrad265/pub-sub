const express = require("express");

const messages = express.Router();

messages.post("/publish", async (req, res) => {
  const { channel, message } = req.body;

  if (!channel || !message) {
    return res.status(400).json({ error: "Channel and message are required" });
  }

  try {
    messageQueue.add("messages", { channel, message });

    ioServer.to(channel).emit("new message", { channel, message });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error publishing message to Redis:", error);
    return res
      .status(500)
      .json({ error: "Failed to publish message to Redis" });
  }
});

module.exports = messages;
