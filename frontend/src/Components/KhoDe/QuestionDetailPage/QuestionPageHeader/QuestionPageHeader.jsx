import React from "react";
import { Link } from "react-router-dom";
import "./QuestionPageHeader.css";

const ExercisePageHeader = ({ grade, subtitle }) => {
  return (
    <div className="exercise-page-header">
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
      <p>
        {subtitle ||
          "Chọn đề thi phù hợp với lớp và bắt đầu luyện tập ngay hôm nay"}
      </p>
    </div>
  );
};

export default ExercisePageHeader;
