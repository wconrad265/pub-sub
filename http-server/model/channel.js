const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  channelName: String,
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

channelSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Channel = mongoose.model("Channel", channelSchema);
module.exports = Channel;
