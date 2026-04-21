import React from "react";
import "./StatsCard.css";
import group from "../Assets/group.png";
import book from "../Assets/book.png";
import document1 from "../Assets/document1.png";
import video from "../Assets/video.png";

const StatsCard = () => {
  return (
    <div className="stats-card">
      <div className="stats-card-container">
        <div className="stat-card stat-card-1">
          <div className="stat-icon-wrapper stat-icon-1">
            <img src={group} alt="Học sinh" />
          </div>
          <div className="stat-number">100+</div>
          <div className="stat-text">Học sinh</div>
        </div>

        <div className="stat-card stat-card-2">
          <div className="stat-icon-wrapper stat-icon-2">
            <img src={book} alt="Bài tập" />
          </div>
          <div className="stat-number">100+</div>
          <div className="stat-text">Bài tập</div>
        </div>

        <div className="stat-card stat-card-3">
          <div className="stat-icon-wrapper stat-icon-3">
            <img src={document1} alt="Đề thi" />
          </div>
          <div className="stat-number">100+</div>
          <div className="stat-text">Đề thi</div>
        </div>

        <div className="stat-card stat-card-4">
          <div className="stat-icon-wrapper stat-icon-4">
            <img src={video} alt="Video bài giảng" />
          </div>
          <div className="stat-number">100+</div>
          <div className="stat-text">Video bài giảng</div>
        </div>
        <div className="stat-card stat-card-5">
          <div className="stat-icon-wrapper stat-icon-5">
            <img src={book} alt="Bài giảng" />
          </div>
          <div className="stat-number">100+</div>
          <div className="stat-text">Bài giảng</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
