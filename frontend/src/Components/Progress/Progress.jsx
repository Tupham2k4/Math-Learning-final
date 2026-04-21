import React from "react";
import "./Progress.css";
import diskette from "../Assets/diskette.png";
import barchart from "../Assets/bar-chart.png";
import study2 from "../Assets/study2.jpg";
const Progress = () => {
  return (
    <div className="progress">
      <div className="progress-container">
        <div className="progress-left">
          <div className="progress-title">
            <h1>Theo dõi tiến độ học tập</h1>
          </div>
          <div className="progress-description">
            <p>
              Ghi lại toàn bộ quá trình học tập của bạn, giúp bạn và phụ huynh
              nắm rõ tiến độ, điểm mạnh và những phần cần cải thiện để đạt kết
              quả tốt
            </p>
          </div>
          <div className="progress-description2">
            <img src={diskette} alt=""></img>
            <p>Thống kê điểm số và tỷ lệ hoàn thành bài tập</p>
          </div>
          <div className="progress-description2">
            <img src={barchart} alt=""></img>
            <p>Lưu trữ lịch sử bài làm và kết quả đạt được</p>
          </div>
        </div>
        <div className="progress-right">
          <img src={study2} alt=""></img>
        </div>
      </div>
    </div>
  );
};
export default Progress;
