const { createSocketServer } = require("./server/socketServer");
const redis = require("redis");

const main = async () => {
  const redisClient = redis.createClient();
  const pubClient = redisClient.duplicate();
  const subClient = redisClient.duplicate();

  await Promise.all([
    redisClient.connect(),
    pubClient.connect(),
    subClient.connect(),
  ]);
  // We create two redis clients with duplicate
  //duplicate allows us have the exact same settings for each redis client
  // The reason we create two, is that we can avoid blocking and separate concerns
  const ioServer = await createSocketServer(pubClient, subClient);

  ioServer.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
};

main();
