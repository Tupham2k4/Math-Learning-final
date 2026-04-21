import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home";
import BaiGiang from "./Pages/BaiGiang";
import BaiTap from "./Pages/BaiTap";
import VideoBaiGiang from "./Pages/VideoBaiGiang";
import KhoDe from "./Pages/KhoDe";
import Chatbot from "./Pages/Chatbot";
import DangNhap from "./Pages/DangNhap";
import ForgotPassword from "./Components/Password/ForgotPassword/ForgotPassword";
import ResetPassword from "./Components/Password/ResetPassword/ResetPassword";
import Footer from "./Components/Footer/Footer";
import DangKy from "./Pages/DangKy";
import ExerciseDetailPage from "./Components/BaiTap/ExerciseDetailPage/ExerciseDetailPage";
import GradeDetailPage from "./Components/BaiGiang/GradeDetailPage/GradeDetailPage";
import LessonDetailPage from "./Components/BaiGiang/LessonDetailPage/LessonDetailPage";
import QuestionDetailPage from "./Components/KhoDe/QuestionDetailPage/QuestionDetailPage";
import ExamDetailPage from "./Components/KhoDe/ExamDetailPage/ExamDetalPage";
import QuizPage from "./Components/Quiz/QuizPage";
import EssayDetailPage from "./Components/BaiTap/EssayDetailPage/EssayDetailPage";
import VideoDetailPage from "./Components/Video/VideoDetailPage/VideoDetailPage";
import WatchVideo from "./Components/Video/WatchVideo/WatchVideo";
import { UserProvider } from "./Context/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bai-giang" element={<BaiGiang />} />
          <Route path="/bai-giang/lop/:gradeId" element={<GradeDetailPage />} />
          <Route
            path="/bai-giang/lop/:gradeId/bai/:lessonId"
            element={<LessonDetailPage />}
          />
          <Route path="/bai-tap" element={<BaiTap />} />
          <Route path="/video-bai-giang" element={<VideoBaiGiang />} />
          <Route path="/kho-de" element={<KhoDe />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/dang-nhap" element={<DangNhap />} />
          <Route path="/dang-ky" element={<DangKy />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/bai-tap/lop/:gradeId"
            element={<ExerciseDetailPage />}
          />
          <Route path="/kho-de/:gradeId" element={<QuestionDetailPage />} />
          <Route
            path="/exam/:id"
            element={<ExamDetailPage />}
          />
          <Route
            path="/bai-tap/lop/:gradeId/trac-nghiem/:lessonId"
            element={<QuizPage />}
          />
          <Route
            path="/bai-tap/lop/:gradeId/tu-luan/:lessonId"
            element={<EssayDetailPage />}
          />
          <Route
            path="/video-bai-giang/chi-tiet"
            element={<VideoDetailPage />}
          />
          <Route path="/video-bai-giang/xem/:videoId" element={<WatchVideo />} />
        </Routes>
        <Footer />
      </div>
      </Router>
    </UserProvider>
  );
}

export default App;
