import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { uploadImage, uploadPDF, uploadImages, uploadPDFs } from "../controllers/uploadController.js";

const router = express.Router();

// 📦 Cấu hình multer (lưu file tạm)
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 📌 Route upload ảnh
router.post("/image", upload.single("image"), uploadImage);
router.post("/images", upload.array("images", 10), uploadImages);

// 📌 Route upload PDF
router.post("/pdf", upload.single("pdf"), uploadPDF);
router.post("/pdfs", upload.array("pdfs", 10), uploadPDFs);

export default router;
