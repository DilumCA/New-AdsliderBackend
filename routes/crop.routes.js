import express from "express";
import multer from "multer";
import sharp from "sharp";

const router = express.Router();
const upload = multer(); // Use memory storage

router.post("/crop", upload.single("image"), async (req, res) => {
  try {
    const { x, y, width, height } = req.body;
    const imageBuffer = req.file.buffer;
    const cropped = await sharp(imageBuffer)
      .extract({
        left: parseInt(x),
        top: parseInt(y),
        width: parseInt(width),
        height: parseInt(height),
      })
      .toFormat("jpeg")
      .toBuffer();
    res.type("image/jpeg").send(cropped);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;