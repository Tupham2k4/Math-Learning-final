import React from "react";
import { Link } from "react-router-dom";
import "./EssayHeader.css";
const EssayHeader = ({ grade, subtitle, lessonTitle }) => {
  return (
    <div className="essay-header">
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
          "Chọn đề thi phù hợp với lớp và bắt đầu luyện tập ngay hôm nay"}
      </p>
      <div className="essay-detail">
        <div className="essay-name">{lessonTitle}</div>
      </div>
    </div>
  );
};

export default EssayHeader;
