const Webhook = require("../model/webhook");
const { Queue, Worker } = require("bullmq");
const { webhookSendQueue } = require("./webhookSendQueue");
const { ObjectId } = require("mongoose").Types;

const webhookChannelQueue = new Queue("webhookChannel", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

const worker = new Worker(
  "webhookChannel",
  async (job) => {
    const { channel, message, channelId } = job.data;
    const mongoChannelId = new ObjectId(channelId);
    const webhooks = await Webhook.find({ channelId: mongoChannelId });

    if (webhooks) {
      for (const webhook of webhooks) {
        await webhookSendQueue.add("webhookSend", {
          url: webhook.url,
          channel,
          message,
        });

        console.log(`Enqueued webhook for URL: ${webhook.url}`);
      }
    }
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

module.exports = { webhookChannelQueue };
