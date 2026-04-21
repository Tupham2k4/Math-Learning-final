import React, { useState, useEffect } from "react";
import axios from "axios";
import video from "../../../Data/video";
import VideoCard from "./VideoCard";
import "./VideoList.css";

const VideoList = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/stats/grade-counts");
        if (res.data.success) {
          setCounts(res.data.countsByGrade);
        }
      } catch (error) {
        console.error("Lỗi khi lấy số video:", error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="video-grid">
      {video.map((item) => (
        <VideoCard 
          key={item.id} 
          item={item} 
          dynamicCount={counts[item.malop]?.videos} 
        />
      ))}
    </div>
  );
};

export default VideoList;
