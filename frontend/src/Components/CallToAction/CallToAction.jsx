import React from "react";
import { Link } from "react-router-dom";
import "./CallToAction.css";
import stars from "../Assets/stars.png";

const CallToAction = () => {
  return (
    <div className="call-to-action">
      <div className="cta-container">
        <h1 className="cta-title">Bắt đầu học toán ngay hôm nay</h1>
        <p className="cta-description">
          Tham gia cùng hàng ngàn học sinh đang học toán hiệu quả mỗi ngày. Khám
          phá bài tập phong phú, video bài giảng sinh động và chatbot hỗ trợ
          thông minh. Nâng cao kiến thức toán học từ lớp 1 đến lớp 12 một cách
          dễ dàng và thú vị
        </p>
        <div className="cta-buttons">
          <Link to="/dang-nhap" className="cta-btn cta-btn-primary">
            <img src={stars} alt="star" className="cta-icon" />
            Đăng ký ngay
          </Link>
          <button className="cta-btn cta-btn-secondary">Tìm hiểu thêm ⟶</button>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
