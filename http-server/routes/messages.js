const express = require("express");
const { messageQueue } = require("../queue/messaageQueue");
const { getEmitterInstance } = require("../config/socket");
const messages = express.Router();

messages.post("/publish", async (req, res) => {
  const { channel, message } = req.body;

  if (!channel || !message) {
    return res.status(400).json({ error: "Channel and message are required" });
  }

  try {
    const emitter = getEmitterInstance();

    messageQueue.add("messages", { channel, message });

    emitter.to(channel).emit("new message", { channel, message });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error publishing message to Redis:", error);
    return res
      .status(500)
      .json({ error: "Failed to publish message to Redis" });
  }
});

module.exports = messages;
