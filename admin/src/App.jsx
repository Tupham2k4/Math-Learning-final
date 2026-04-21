import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Dangnhap from "./Pages/Dangnhap";
import Dangky from "./Pages/Dangky";
import AdminDashboard from "./Pages/AdminDashboard";
import ChapterManagement from "./Pages/ChapterManagement";
import AccountManagement from "./Pages/AccountManagement";
import LessonManagement from "./Pages/LessonManagement";
import ExerciseManagement from "./Pages/ExerciseManagement";
import ExamManagement from "./Pages/ExamManagement";
import VideoManagement from "./Pages/VideoManagement";
import CommentManagement from "./Pages/CommentManagement";
import StudyHistory from "./Pages/StudyHistory";
import ChatbotManagement from "./Pages/ChatbotManagement";
import AdminChatDetail from "./Components/ChatbotManagement/AdminChatDetail/AdminChatDetail";
const AdminLayout = () => {
  return (
    <>
      <Navbar />
      <div
        className="app-layout"
        style={{ display: "flex", alignItems: "flex-start" }}
      >
        <Sidebar />
        <main className="content" style={{ flex: 1, padding: "24px", backgroundColor: "#f9fafb", minHeight: "100vh", overflowY: "auto", boxSizing: "border-box" }}>
          <Outlet />
        </main>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Trang đăng nhập riêng biệt, không có Navbar/Sidebar */}
          <Route path="/dang-nhap-admin" element={<Dangnhap />} />
          <Route path="/dang-ky-admin" element={<Dangky />} />

          {/* Các trang Admin khác có Navbar/Sidebar */}
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="/quan-ly-chuong-bai" element={<ChapterManagement />} />
            <Route path="/quan-ly-tai-khoan" element={<AccountManagement />} />
            <Route path="/quan-ly-bai-giang" element={<LessonManagement />} />
            <Route path="/quan-ly-bai-tap" element={<ExerciseManagement />} />
            <Route path="/quan-ly-kho-de" element={<ExamManagement />} />
            <Route path="/quan-ly-video" element={<VideoManagement />} />
            <Route path="/quan-ly-binh-luan" element={<CommentManagement />} />
            <Route path="/luu-tru-bai-lam" element={<StudyHistory />} />
            <Route path="/quan-ly-chatbot" element={<ChatbotManagement />} />
            <Route path="/quan-ly-chatbot/:conversationId" element={<AdminChatDetail />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
