import React from "react";
import { Link } from "react-router-dom";
import "./ExamDetalPageHeader.css";
const ExamDetalPageHeader = ({ grade, subtitle, lessonTitle }) => {
  return (
    <div className="exam-detail-page-header">
      <div className="breadcrumb">
        <Link to="/" className="home-link">
          Trang chủ
        </Link>
        <span className="separator"> ⟶ </span>
        <Link to="/kho-de" className="home-link">
          Kho đề
        </Link>
        <span className="separator"> ⟶ </span>
        <span className="current">Toán học lớp {grade}</span>
      </div>
      <h1>Toán học lớp {grade}</h1>
      <div className="exam-detail">
        <div className="exam-name">{lessonTitle}</div>
      </div>
    </div>
  );
};

export default ExamDetalPageHeader;
