const connection = require("../../config/redis.config");
const { Worker } = require("bullmq");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
require("dotenv").config();

const worker = new Worker(
  "imageProcessing",
  async (job) => {
    const { imageUrl } = job.data;

    console.log("Worker received job data:", job.data);
    console.log("Processing image at:", imageUrl);

    if (!imageUrl) {
      throw new Error("imageUrl is undefined in job data");
    }

    try {
      if (!fs.existsSync(imageUrl)) {
        throw new Error(`File not found at: ${imageUrl}`);
      }

      const formData = new FormData();
      const fileStream = fs.createReadStream(imageUrl);
      formData.append("image", fileStream);

      const response = await axios.post(
        "https://api.deepai.org/api/studio-ghibli",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "api-key":
              process.env.DEEPAI_API_KEY ||
              "b8293e8a-768a-4fc1-b6f8-e200e6f614b7",
          },
        }
      );

      const { output_url: ghibliUrl } = response.data;

      if (!ghibliUrl) {
        throw new Error("No output_url in DeepAI response");
      }

      fs.unlinkSync(imageUrl);

      return { ghibliUrl };
    } catch (error) {
      console.error("DeepAI Error:", error.message, error.stack);
      throw error;
    }
  },
  { connection }
);

worker.on("completed", async (job, result) => {
  console.log(`Job ${job.id} completed. Ghibli-style URL: ${result.ghibliUrl}`);
  await connection.set(
    `job:${job.id}`,
    JSON.stringify({ status: "completed", url: result.ghibliUrl })
  );
});

worker.on("failed", async (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
  await connection.set(
    `job:${job.id}`,
    JSON.stringify({
      status: "failed",
      error: err.message,
    })
  );
});
