const express = require("express");
const server = express();
const cors = require("cors");
const imageRouter = require("./routes/image/image.route");
require("dotenv").config();

server.use(cors());

server.use("/api", imageRouter);

server.listen(process.env.PORT || 3000, () => {
  try {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  } catch (error) {
    console.error("Error starting the server:", error);
  }
});
