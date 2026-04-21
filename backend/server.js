import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectcloudinary from "./config/cloudinary.js";
import authRoutes from "./routes/authRoutes.js";
import chapterRoutes from "./routes/chapterRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import adminChatRoutes from "./routes/adminChatRoutes.js";
//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectcloudinary();
//middleware
app.use(express.json());
app.use(cors());

//khởi tạo các routes
app.use("/api/auth", authRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/lessons", lessonRoutes);
app.get("/", (req, res) => res.send("API Working"));
app.use("/api/upload", uploadRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin/chat", adminChatRoutes);

//start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
