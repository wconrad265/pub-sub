const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: String,
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },
});

messageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
