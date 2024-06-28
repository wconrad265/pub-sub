require("dotenv").config();
const { createServer } = require("http");
const { connectMongoDB } = require("./config/db");
const { ioServer } = require("./config/socket");
const app = require("./app");
const PORT = process.env.PORT || 3000;
const io = ioServer();

connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
