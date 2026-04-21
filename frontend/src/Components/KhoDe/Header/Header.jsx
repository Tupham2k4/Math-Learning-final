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
        <span className="current">Kho đề</span>
      </div>
      <h1>Kho đề thi toán</h1>
      <p>
        Chọn đề thi phù hợp với lớp và chủ đề để bắt đầu luyện tập ngay hôm nay
      </p>
    </div>
  );
};

export default Header;
