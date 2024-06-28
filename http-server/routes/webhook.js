const express = require("express");
const Webhook = require("../model/webhook");
const Channel = require("../model/channel");

const webhookRoute = express.Router();

webhookRoute.post("/subscribe", async (req, res) => {
  const { channel, url } = req.body;

  if (!channel || !url) {
    return res.status(400).json({ error: "Channel and message are required" });
  }
  const foundChannel = await Channel.findOne({ channelName: channel });

  if (!foundChannel) {
    return res.status(404).json({ error: "Channel not found" });
  }
  try {
    await Webhook.findOneAndUpdate(
      { channelId: foundChannel._id },
      { url },
      { new: true, upsert: true }
    );

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error registering webhook:", error);
    return res.status(500).json({ error: "Failed to register webhook" });
  }
});

webhookRoute.post("/unsubscribe", async (req, res) => {
  const { channel, url } = req.body;

  if (!channel || !url) {
    return res.status(400).json({ error: "Channel and message are required" });
  }

  try {
    const foundChannel = await Channel.findOne({ channelName: channel });

    if (!foundChannel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    
    const deleteResult = await Webhook.deleteOne({
      channelId: foundChannel._id,
      url,
    });

    console.log(deleteResult);

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: "Webhook not found" });
    }

    return res.status(201).json({ success: true, message: "webhook deleted" });
  } catch (error) {
    console.error("Error unsubscribing webhook:", error);
    return res.status(500).json({ error: "Failed to register webhook" });
  }
});

module.exports = webhookRoute;
