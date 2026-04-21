import React from "react";
import { useNavigate } from "react-router-dom";
import "./VideoCard.css";
import video from "../../Assets/video.png";
const VideoCard = ({ item, dynamicCount }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate("/video-bai-giang/chi-tiet", {
      state: {
        grade: item.malop,
        title: item.tenlop,
        totalVideos: item.sovideo,
      },
    });
  };

  return (
    <div className="video-card">
      <div className="video-card-top" style={{ backgroundColor: item.maunen }}>
        <span className="video-badge">Lớp {item.malop}</span>
        <h3>{item.tenlop}</h3>
        <p>{item.mota}</p>
      </div>
      <div className="video-bottom">
        <div className="video-lessons">
          <img src={video} alt="" className="lesson-icon" />
          <span>{dynamicCount !== undefined ? dynamicCount : item.sovideo} video</span>
        </div>
        <div className="video-button">
          <button
            className="btn-video color"
            style={{ backgroundColor: item.maunut }}
            onClick={handleViewClick}
          >
            Xem ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
