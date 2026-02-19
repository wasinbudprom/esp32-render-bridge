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

app.post("/upload", async (req, res) => {
  const { image } = req.body; // รับรูปที่เป็น Base64 string

  try {
    // ส่งเข้า Firebase ตรงๆ ไม่ต้องเซฟลงเครื่อง Render
    await db.ref("/device/esp32_01/camera/lastImage").set(`data:image/jpeg;base64,${image}`);
    res.json({ status: "success" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => console.log("Server running on Render"));
