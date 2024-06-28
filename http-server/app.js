const express = require("express");
const bodyParser = require("body-parser");
const messages = require("./routes/messages");

const app = express();

app.use(bodyParser.json());
app.use("/api", messages);

module.exports = app;
