const { Queue } = require("bullmq");
const connection = require("../../config/redis.config");
const imageQueue = new Queue("image Processing", { connection });
module.exports = imageQueue;
