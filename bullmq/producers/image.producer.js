const ImageQueue = require("../queues/image.queue");

const addImageProducer = async (imageUrl) => {
  try {
    const job = await ImageQueue.add(
      "imageRestyle",
      { imageUrl },
      {
        delay: 5000, 
        removeOnComplete: {
          age: 3600, 
          count: 1000,
        },
        removeOnFail: {
          age: 24 * 3600, 
        },
      }
    );
    return job; 
  } catch (error) {
    console.error("Error in addImageProducer:", error);
    throw error; 
  }
};

module.exports = addImageProducer;