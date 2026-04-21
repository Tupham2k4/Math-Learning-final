import express from "express";
import {
  submitQuiz,
  getPendingResults,
  getResultDetail,
  gradeResultByAdmin,
  getAllResults,
  getLatestResultByUserAndLesson,
  deleteResult,
  getResultStatsOverview,
} from "../controllers/resultController.js";

const router = express.Router();

router.post("/submit", submitQuiz);
router.get("/latest", getLatestResultByUserAndLesson);
router.get("/stats", getResultStatsOverview);
router.get("/pending", getPendingResults);
router.get("/all", getAllResults);
router.patch("/grade/:id", gradeResultByAdmin);
router.put("/grade/:id", gradeResultByAdmin);
router.get("/:resultId", getResultDetail);
router.delete("/:id", deleteResult);

export default router;
