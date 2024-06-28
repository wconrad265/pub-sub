require("dotenv").config();
const { createSocketServer } = require("./server/socketServer");
const mongoose = require("mongoose");
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to mongodb"));

const ioServer = createSocketServer();

ioServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
