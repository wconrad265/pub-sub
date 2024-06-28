const mongoose = require("mongoose");
require("dotenv").config();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongodb");
  } catch (error) {
    console.error("error connecting to mongodb");
  }
};

module.exports = { connectMongoDB };
