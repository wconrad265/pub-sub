const { Queue, Worker } = require("bullmq");
const { addMessage } = require("../utils/addMessage");

const messageQueue = new Queue("messages", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

const worker = new Worker(
  "messages",
  async (job) => {
    const { channel, message, channelId } = job.data;
    await addMessage(channel, message, channelId);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

worker.on("completed", (job) => {
  console.log(
    `${job.id} has completed!, with message ${job.data.message} and has been saved to mongodb`
  );
});

worker.on("failed", (job, err) => {
  console.log(
    `${job.id} has failed with ${err.message}. Message has not been saved to mongodb`
  );
});

module.exports = { messageQueue, worker };
