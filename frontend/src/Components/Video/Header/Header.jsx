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
        <span className="current">Video bài giảng</span>
      </div>
      <h1>Video bài giảng toán</h1>
      <p>
        Khám phá hàng trăm video bài giảng chất lượng cao từ lớp 1 đến lớp 12
        được biên soạn bởi đội ngũ giáo viên giàu kinh nghiệm{" "}
      </p>
    </div>
  );
};

export default Header;
