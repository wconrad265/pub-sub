const { Queue, Worker } = require("bullmq");
const axios = require("axios");

const webhookSendQueue = new Queue("webhookSend", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

const worker = new Worker(
  "webhookSend",
  async (job) => {
    const { channel, message, url } = job.data;
    console.log(channel, message, url);
    await axios.post(url, { channel, message });
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

worker.on("completed", (job) => {
  const { channel, message, url } = job.data;
  console.log(`${job.id} has completed!, with message ${job.data.message}`);
  console.log(`${url} has been send the data in ${channel}, ${message}`);
});

worker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

module.exports = { webhookSendQueue };
