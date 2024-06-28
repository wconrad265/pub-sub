require("dotenv").config();
const { createSocketServer } = require("./server/socketServer");
const Redis = require("ioredis");
const mongoose = require("mongoose");
const PORT = process.env.PORT;

const redisClient = new Redis(process.env.REDIS_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to mongodb"));

const ioServer = createSocketServer(redisClient);

ioServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
