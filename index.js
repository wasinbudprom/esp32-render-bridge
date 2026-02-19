// server.js
const express = require("express");
const multer = require("multer");
const app = express();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".jpg");
  },
});

const upload = multer({ storage });

app.use("/images", express.static("uploads"));

app.post("/upload", upload.single("image"), (req, res) => {
  const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  res.json({ url: imageUrl });
});

app.listen(3000, () => console.log("Server running"));
