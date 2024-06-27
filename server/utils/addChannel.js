const Channel = require("../model/channel");

const addChannel = async (channelName) => {
  const existingChannel = await Channel.findOne({ channelName });

  if (!existingChannel) {
    const channel = new Channel({ channelName });
    await channel.save();
  }
};

module.exports = {
  addChannel,
};
