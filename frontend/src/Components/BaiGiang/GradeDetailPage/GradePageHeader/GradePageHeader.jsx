import React from "react";
import { Link } from "react-router-dom";
import "./GradePageHeader.css";

const GradePageHeader = ({ grade, subtitle }) => {
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
        <span className="current">Toán học lớp {grade}</span>
      </div>
      <h1>Toán học lớp {grade}</h1>
      <p>{subtitle || "Chọn bài học và bắt đầu luyện tập ngay hôm nay"}</p>
    </div>
  );
};

export default GradePageHeader;
