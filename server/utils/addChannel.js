const Channel = require("../model/channel");

const addChannel = async (channelName) => {
  const channel = new Channel({ channelName });

  await channel.save();
  console.log("added to mongo");
};

module.exports = {
  addChannel,
};
