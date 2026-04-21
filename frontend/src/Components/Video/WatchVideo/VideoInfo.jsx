import React from "react";
import "./WatchVideo.css";

const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleDateString("vi-VN");
};

const VideoInfo = ({ video }) => {
  if (!video) return null;

  return (
    <div className="video-info-card">
      <h1 className="video-info-title">{video.title}</h1>

      <div className="video-info-meta">
        <span>{video.views} lượt xem</span>
        <span className="video-info-dot">•</span>
        <span>{formatDate(video.uploadDate)}</span>
      </div>

      <div className="video-info-description">
        <h3>Mô tả</h3>
        <p>{video.description}</p>
      </div>
    </div>
  );
};

export default VideoInfo;
