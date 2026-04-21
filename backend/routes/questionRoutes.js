import express from "express";
import {
    getQuestionsByLesson,
    createQuestion,
    createManyQuestions,
    deleteQuestion,
    updateQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getQuestionsByLesson);
router.post("/", createQuestion);
router.post("/many", createManyQuestions);
router.delete("/:id", deleteQuestion);
router.put("/:id", updateQuestion);

export default router;