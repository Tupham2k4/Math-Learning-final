import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import book from "../Assets/book.png";
import video from "../Assets/video.png";
import logo2 from "../Assets/logo2.png";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-left">
          <div className="hero-left-title">
            <img src={book} alt="book icon" />
            <p>Toán học dành cho học sinh lớp 1-12</p>
          </div>

          <div className="hero-left-description">
            <h1>Khám phá thế giới toán học thú vị cùng chúng tôi</h1>
            <p>
              Nền tảng học tập trực tuyến với hàng ngàn bài tập trắc nghiệm, tự
              luận, kho đề thi phong phú và video bài giảng chất lượng cao. Học
              toán chưa bao giờ dễ dàng đến thế.
            </p>
          </div>

          <div className="hero-left-actions">
            <Link to="/bai-tap" className="hero-btn start-btn">
              <img src={book} alt="book icon" />
              Bắt đầu học
            </Link>
            <Link to="/video-bai-giang" className="hero-btn video-btn">
              <img src={video} alt="video icon" />
              Xem video bài giảng
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <img src={logo2} alt="Math Learning" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
