require("dotenv").config();

const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URI);

module.exports = { redisClient };
