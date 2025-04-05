const { Queue } = require("bullmq");
const connection = require("../../config/redis.config");
const imageQueue = new Queue("imageProcessing", { connection });
module.exports = imageQueue;
