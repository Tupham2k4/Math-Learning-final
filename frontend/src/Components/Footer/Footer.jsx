import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import logo1 from "../Assets/logo1.png";
import facebook from "../Assets/facebook.png";
import instagram from "../Assets/instagram.png";
import tiktok from "../Assets/tiktok.png";
const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <img src={logo1} alt="Logo" className="footer-logo"></img>
          <p className="footer-subtitle">Nền tảng học toán trực tuyến dành cho học sinh lớp 1-12</p>
        </div>
        <div className="footer-col">
          <h1>Liên kết nhanh</h1>
          <Link to="/">Trang chủ</Link>
          <Link to="/bai-tap">Bài tập</Link>
          <Link to="/bai-giang">Bài giảng</Link>
          <Link to="/video-bai-giang">Video bài giảng</Link>
          <Link to="/kho-de">Kho đề</Link>
          <Link to="/chatbot">Chatbot AI</Link>
        </div>
        <div className="footer-col">
          <div className="footer-col-info">
            <h1>Liên hệ</h1>
            <p>Email: quangtupham2k4@gmail.com</p>
            <p>Hotline: 0123456789</p>
          </div>
          <div className="footer-col-link">
            <h1>Về chúng tôi</h1>
            <img src={facebook} alt=""></img>
            <img src={instagram} alt=""></img>
            <img src={tiktok} alt=""></img>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <p>@Copyright by Pham Quang Tu - 11226675</p>
      </div>
    </div>
  );
};
export default Footer;
