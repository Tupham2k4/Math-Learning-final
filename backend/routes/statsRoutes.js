import express from "express";
import { getDashboardStats, getGradeCounts } from "../controllers/statsController.js";

const router = express.Router();

router.get("/", getDashboardStats);
router.get("/grade-counts", getGradeCounts);

export default router;
