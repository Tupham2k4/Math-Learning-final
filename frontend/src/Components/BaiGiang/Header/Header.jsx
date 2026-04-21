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
        <span className="current">Bài giảng</span>
      </div>
      <h1>Bài giảng toán học</h1>
      <p>Nơi lưu trữ hàng ngàn bài giảng hữu ích cho học sinh</p>
    </div>
  );
};

export default Header;
