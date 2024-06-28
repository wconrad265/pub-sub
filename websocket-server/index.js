const { createSocketServer } = require("./server/socketServer");
const Redis = require("ioredis");
const mongoose = require("mongoose");

const main = async () => {
  const redisClient = new Redis();

  await Promise.all([
    mongoose
      .connect("mongodb://localhost:27017/Chat")
      .then(() => console.log("connected to mongodb")),
  ]);

  const ioServer = await createSocketServer(redisClient);

  ioServer.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
};

main();
