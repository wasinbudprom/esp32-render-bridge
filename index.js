const express = require("express");
const admin = require("firebase-admin");
const app = express();

app.use(express.json({ limit: "10mb" })); // รองรับ Base64 จาก ESP32

// ดึงค่ากุญแจจาก Environment Variable ที่เราตั้งใน Render
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hydroponic-ddc5e-default-rtdb.asia-southeast1.firebasedatabase.app/", // ใส่ URL ของคุณ
});

const db = admin.database();

app.post(
  "/upload",
  express.raw({ type: "image/jpeg", limit: "5mb" }),
  (req, res) => {
    const fs = require("fs");
    const path = require("path");

    const filename = Date.now() + ".jpg";
    const filepath = path.join(__dirname, "uploads", filename);

    fs.writeFileSync(filepath, req.body);

    const imageUrl = `${req.protocol}://${req.get("host")}/images/${filename}`;

    res.json({ url: imageUrl });
  },
);


app.listen(3000, () => console.log("Server running on Render"));
