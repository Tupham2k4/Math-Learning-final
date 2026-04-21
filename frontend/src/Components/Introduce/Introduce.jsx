import React from "react";
import "./Introduce.css";
import study from "../Assets/study.png";
import book from "../Assets/book.png";
import check from "../Assets/check.png";
const Introduce = () => {
  return (
    <div className="introduce">
      <div className="introduce-container">
        <div className="introduce-left">
          <img src={study} alt=""></img>
        </div>
        <div className="introduce-right">
          <div className="introduce-title">
            <h1>Học tập cá nhân hóa</h1>
          </div>
          <div className="introduce-description">
            <p>
              Hệ thống cung cấp trải nghiệm học tập toán học được thiết kế riêng
              cho từng học sinh, giúp các em phát triển năng lực và tự tin hơn
              trong môn toán.
            </p>
          </div>
          <div className="introduce-description2">
            <img src={book} alt=""></img>
            <p>Nội dung bài học phù hợp với từng khối lớp từ 1-12</p>
          </div>
          <div className="introduce-description2">
            <img src={check} alt=""></img>
            <p>Bài tập được phân loại theo chủ đề và độ khó</p>
          </div>
          <div className="introduce-description2">
            <img src={check} alt=""></img>
            <p>Giải thích chi tiết đáp án khi làm sai</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Introduce;
