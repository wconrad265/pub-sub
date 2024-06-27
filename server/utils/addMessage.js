const Message = require("../model/message");
const Channel = require("../model/channel");

const addMessage = async (channelName, content) => {
  let foundChannel = await Channel.findOne({ channelName: channelName });

  const message = new Message({
    content,
    channel: foundChannel._id,
  });

  const savedMessage = await message.save();
  foundChannel.messages = foundChannel.messages.concat(savedMessage._id);

  await foundChannel.save();
};

module.exports = {
  addMessage,
};
