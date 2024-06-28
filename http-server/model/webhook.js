const mongoose = require("mongoose");

const webhookSchema = new mongoose.Schema({
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const Webhook = mongoose.model("Webhook", webhookSchema);

module.exports = Webhook;
