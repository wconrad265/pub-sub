require("dotenv").config();
const { connectMongoDB } = require("./config/db");
const { createIoEmitter } = require("./config/socket");
const app = require("./app");
const PORT = process.env.PORT || 3000;

createIoEmitter();
connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
