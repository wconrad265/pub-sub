const mongoose = require("mongoose");

const webhookSchema = new mongoose.Schema({
  channel: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const Webhook = mongoose.model("Webhook", webhookSchema);

module.exports = Webhook;
