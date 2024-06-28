const Channel = require("../model/channel");
const fetchMessages = require("./getChannelMessages");
const findChannel = async (channelName) => {
  const existingChannel = await Channel.findOne({ channelName }).populate(
    "messages"
  );

  if (!existingChannel) {
    const channel = new Channel({ channelName });
    await channel.save();
    return channel;
  } else {
    return existingChannel;
  }
};

module.exports = {
  findChannel,
};
