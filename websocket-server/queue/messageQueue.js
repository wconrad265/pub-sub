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
    const { channel, message } = job.data;
    await addMessage(channel, message);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!, with message ${job.data.message}`);
});

worker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

module.exports = { messageQueue, worker };
