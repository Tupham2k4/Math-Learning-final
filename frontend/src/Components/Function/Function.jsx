import React from "react";
import "./Function.css";
import { Link } from "react-router-dom";
import book2 from "../Assets/book2.png";
import book3 from "../Assets/book3.png";
import document3 from "../Assets/document3.png";
import chatbubble from "../Assets/chat-bubble.png";
import video1 from "../Assets/video1.png";

const Function = () => {
  return (
    <div className="function">
      <h1>Các chức năng chính</h1>
      <p className="function-subtitle">
        Khám phá các công cụ học tập toán học hiện đại giúp bạn nâng cao kiến
        thức và kỹ năng
      </p>
      <div className="function-container">
        <div className="function-item">
          <div className="icon-wrapper icon-book-bg">
            <img src={book2} alt="Bài tập" className="icon-book"></img>
          </div>
          <h2>Bài tập</h2>
          <p>
            Làm bài tập trắc nghiệm và tự luận với hệ thống chấm điểm tự động và
            giải thích chi tiết
          </p>
          <Link to="/bai-tap" className="function-click">
            Bắt đầu làm bài ⭢
          </Link>
        </div>
        <div className="function-item">
          <div className="icon-wrapper icon-book2-bg">
            <img src={book3} alt="Bài giảng" className="icon-book2"></img>
          </div>
          <h2>Bài giảng</h2>
          <p>
            Hệ thống bài giảng chọn lọc, dễ hiểu, theo chương trình dạy của Bộ
            giáo dục và Đào tạo
          </p>
          <Link to="/bai-giang" className="function-click">
            Chi tiết ⭢
          </Link>
        </div>
        <div className="function-item">
          <div className="icon-wrapper icon-document-bg">
            <img src={document3} alt="Kho đề" className="icon-document"></img>
          </div>
          <h2>Kho đề</h2>
          <p>
            Truy cập kho đề thi phong phú cho các học sinh từ lớp 1 đến lớp 12
          </p>
          <Link to="/kho-de" className="function-click">
            Xem kho đề ⭢
          </Link>
        </div>
        <div className="function-item">
          <div className="icon-wrapper icon-video-bg">
            <img
              src={video1}
              alt="Video bài giảng"
              className="icon-video"
            ></img>
          </div>
          <h2>Video bài giảng</h2>
          <p>
            Học tập qua video bài giảng sinh động và dễ hiểu từ các giáo viên
          </p>
          <Link to="/video-bai-giang" className="function-click">
            Xem video ⭢
          </Link>
        </div>
        <div className="function-item">
          <div className="icon-wrapper icon-chatbot-bg">
            <img
              src={chatbubble}
              alt="Chatbot hỗ trợ"
              className="icon-chatbot"
            ></img>
          </div>
          <h2>Chatbot hỗ trợ</h2>
          <p>Nhận trợ giúp ngay lập tức từ chatbot AI cho các câu hỏi khó</p>
          <Link to="/chatbot" className="function-click">
            Trò chuyện ngay ⭢
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Function;
