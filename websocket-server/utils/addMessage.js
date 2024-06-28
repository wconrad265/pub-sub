const Message = require("../model/message");
const Channel = require("../model/channel");

const addMessage = async (channelName, content, channelId) => {
  const message = new Message({
    content,
    channel: channelId,
  });

  const savedMessage = await message.save();
  
  await Channel.findByIdAndUpdate(channelId, {
    $push: { messages: savedMessage._id },
  });
};

module.exports = {
  addMessage,
};
