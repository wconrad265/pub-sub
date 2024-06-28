require("dotenv").config();
const { createServer } = require("http");
const { connectMongoDB } = require("./config/db");
const { ioServer } = require("./config/socket");
const app = require("./app");
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = ioServer(httpServer);

app.set("io", io);

connectMongoDB();

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
