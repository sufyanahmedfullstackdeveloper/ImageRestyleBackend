
const uploadImage = async (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).send("No photo uploaded");
  }
};

module.exports = { uploadImage };
