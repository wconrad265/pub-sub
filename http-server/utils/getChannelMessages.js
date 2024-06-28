const Message = require("../model/message");

const fetchMessages = async (lastTimestamp = null) => {
  try {
    let query = Message.find();

    if (lastTimestamp) {
      query = query.where("timestamp").lt(lastTimestamp);
    }

    query = query.sort({ timestamp: -1 });

    query = query.limit(30);

    const messages = await query.exec();
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

module.exports = { fetchMessages };
