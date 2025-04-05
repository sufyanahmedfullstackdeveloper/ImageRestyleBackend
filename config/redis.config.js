const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  // password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB || 0,
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log(" Redis connected");
});

redis.on("error", (err) => {
  console.error(" Redis error:", err);
});

module.exports = redis;
