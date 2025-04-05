const fs = require("fs");
const FormData = require("form-data"); 

const uploadImage = async (req, res) => {
  try {


    if (!req.file) {
      return res.status(400).send("No photo uploaded");
    }

    const formData = new FormData();
    const fileStream = fs.createReadStream(req.file.path);

    formData.append("image", fileStream, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

 
    const formHeaders = formData.getHeaders();

    const resp = await fetch(process.env.DEEP_AI_API_URL, {
      method: "POST",
      headers: {
        "api-key": process.env.DEEP_AI_API_KEY,
        ...formHeaders, 
      },
      body: formData,
    });

    if (!resp.ok) {
      throw new Error(`API request failed with status ${resp.status}`);
    }

    const data = await resp.json();
    console.log(data);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).send(`Error processing image: ${error.message}`);
  } finally {
  
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    }
  }
};

module.exports = { uploadImage };
