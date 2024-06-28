const Channel = require("../model/channel");
const fetchMessages = require("./getChannelMessages");

const addChannel = async (channelName) => {
  const existingChannel = await Channel.findOne({ channelName }).populate(
    "messages"
  );

  if (!existingChannel) {
    const channel = new Channel({ channelName });
    await channel.save();
  }

  return existingChannel;
};

module.exports = {
  addChannel,
};
