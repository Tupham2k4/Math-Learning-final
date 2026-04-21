import React from "react";
import { Link } from "react-router-dom";
import "./QuizHeader.css";
const QuizHeader = ({ grade, subtitle, lessonTitle, timeLeft, formatTime }) => {
  return (
    <div className="quiz-header">
      <div className="breadcrumb">
        <Link to="/" className="home-link">
          Trang chủ
        </Link>
        <span className="separator"> ⟶ </span>
        <Link to="/bai-tap" className="home-link">
          Bài tập
        </Link>
        <span className="separator"> ⟶ </span>
        <span className="current">Toán học lớp {grade}</span>
      </div>
      <h1>Toán học lớp {grade}</h1>
      <p>
        {subtitle ||
          "Chọn bài học phù hợp với lớp và bắt đầu luyện tập ngay hôm nay"}
      </p>
      <div className="exercise-detail">
        <div className="exercise-name">{lessonTitle}</div>
        <div className="timer">Thời gian còn lại: {formatTime(timeLeft)}</div>
      </div>
    </div>
  );
};

export default QuizHeader;
