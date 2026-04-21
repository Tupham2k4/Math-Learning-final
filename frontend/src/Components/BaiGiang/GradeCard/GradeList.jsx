import React, { useState, useEffect } from "react";
import axios from "axios";
import grades from "../../../Data/Grade.js";
import GradeCard from "./GradeCard";
import "./GradeList.css";

const GradeList = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/stats/grade-counts");
        if (res.data.success) {
          setCounts(res.data.countsByGrade);
        }
      } catch (error) {
        console.error("Lỗi khi lấy số bài giảng:", error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="grade-grid">
      {grades.map((item) => (
        <GradeCard 
          key={item.id} 
          item={item} 
          dynamicCount={counts[item.malop]?.lessons} 
        />
      ))}
    </div>
  );
};

export default GradeList;
