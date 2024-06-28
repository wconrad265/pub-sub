const express = require("express");
const bodyParser = require("body-parser");
const messages = require("./routes/messages");
const webhookRoute = require("./routes/webhook");

const app = express();

app.use(bodyParser.json());
app.use("/api", messages);
app.use("/api/webhook", webhookRoute);
module.exports = app;
