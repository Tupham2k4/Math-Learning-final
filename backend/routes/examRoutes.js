import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getExamsByChapter,
  getSpecialExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  createManyExams,
} from "../controllers/examController.js";
import { auth } from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

//Cấu hình upload
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

router.get("/chapter", getExamsByChapter);
router.get("/special", getSpecialExams);
router.get("/:id", getExamById);
router.post(
  "/",
  auth,
  adminMiddleware,
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "pdfs", maxCount: 20 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createExam,
);
router.put(
  "/:id",
  auth,
  adminMiddleware,
  upload.fields([{ name: "pdf", maxCount: 1 }]),
  updateExam
);
router.delete("/:id", auth, adminMiddleware, deleteExam);
router.post("/many", auth, adminMiddleware, createManyExams);

export default router;
