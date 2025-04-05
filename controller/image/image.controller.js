const connection = require("../../config/redis.config");
const path = require("path");
const addImageProducer = require("../../bullmq/producers/image.producer");
const imageRestyle = async (req, res) => {
  try {
    const imagePath = path.resolve(req.file.path);

    const job = await addImageProducer(imagePath);
    console.log(job.id, "job");
    return res.json({ message: "Image queued for processing", jobId: job.id });
  } catch (error) {
    console.log(error);
  }
};
const imageStatus = async (req, res) => {
  const jobId = req.params.jobId;
  const result = await connection.get(`job:${jobId}`);

  if (result) {
    const parsedResult = JSON.parse(result);

    await connection.del(`job:${jobId}`);
    
    if (parsedResult.status === "failed") {
      return res.status(400).json({
        status: "failed",
        error: parsedResult.error
      });
    }

    return res.json({
      status: parsedResult.status,
      resultUrl: parsedResult.url,
    });
  } else {
    return res.json({ status: "processing" });
  }
};

module.exports = { imageRestyle, imageStatus };
