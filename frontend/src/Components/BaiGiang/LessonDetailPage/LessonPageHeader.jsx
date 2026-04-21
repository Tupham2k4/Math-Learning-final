import React from "react";
import { Link } from "react-router-dom";
import "./LessonPageHeader.css";

const LessonPageHeader = ({ grade, lessonTitle, subtitle }) => {
  return (
    <div className="grade-page-header">
      <div className="breadcrumb">
        <Link to="/" className="home-link">
          Trang chủ
        </Link>
        <span className="separator"> ⟶ </span>
        <Link to="/bai-giang" className="home-link">
          Bài giảng
        </Link>
        <span className="separator"> ⟶ </span>
        <Link to={`/bai-giang/lop/${grade}`} className="home-link">
          Toán học lớp {grade}
        </Link>
        <span className="separator"> ⟶ </span>
        <span className="current">{lessonTitle}</span>
      </div>
      <h1>Bài giảng toán học lớp {grade}</h1>
      <p>{subtitle || "Nơi lưu trữ hàng ngàn bài giảng hữu ích cho học sinh"}</p>
    </div>
  );
};

export default LessonPageHeader;

