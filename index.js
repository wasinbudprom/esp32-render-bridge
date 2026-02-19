// index.js (Render Server)
const express = require("express");
const admin = require("firebase-admin");
const app = express();

// ตั้งค่าให้รับ Body แบบ Binary (Raw data)
app.use(express.raw({ type: "image/jpeg", limit: "10mb" }));

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://hydroponic-ddc5e-default-rtdb.asia-southeast1.firebasedatabase.app/",
});
const db = admin.database();

app.post("/upload", async (req, res) => {
  try {
    // แปลง Binary ที่ได้จาก ESP32 เป็น Base64 string
    const base64Image = req.body.toString("base64");
    const fullDataUri = `data:image/jpeg;base64,${base64Image}`;

    // ส่งเข้า Firebase พาธที่ React รออ่านอยู่
    await db.ref("device/esp32_01/camera/lastImage").set(fullDataUri);

    console.log("Image updated successfully");
    res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.listen(process.env.PORT || 3000);
