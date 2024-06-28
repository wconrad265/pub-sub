const express = require("express");
const bodyParser = require("body-parser");
const Redis = require("ioredis");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-streams-adapter");
const { messageQueue } = require("./queue/queue");
const mongoose = require("mongoose");

const app = express();
const redisClient = new Redis();

const httpServer = createServer();

const ioServer = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

ioServer.adapter(createAdapter(redisClient));

mongoose
  .connect("mongodb://localhost:27017/Chat")
  .then(() => console.log("connected to mongodb")),
  app.use(bodyParser.json());

app.post("/publish", async (req, res) => {
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

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`HTTP server is running on http://localhost:${PORT}`);
});
