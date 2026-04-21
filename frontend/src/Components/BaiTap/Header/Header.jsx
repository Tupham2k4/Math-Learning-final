import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div className="header">
      <div className="breadcrumb">
        <Link to="/" className="home-link">
          Trang chủ
        </Link>
        <span className="separator"> ⟶ </span>
        <span className="current">Bài tập</span>
      </div>
      <h1>Bài tập toán học</h1>
      <p>Chọn lớp học và bắt đầu luyện tập ngay hôm nay</p>
    </div>
  );
};

export default Header;
