const express = require("express");
const router = express.Router();
const upload = require("../../middleware/upload.middleware");
const { imageRestyle,imageStatus } = require("../../controller/image/image.controller");

router.post("/upload-image", upload.single("image"), imageRestyle);
router.get('/status/:jobId',imageStatus);
module.exports = router;
