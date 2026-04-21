import React, { useState, useEffect } from "react";
import axios from "axios";
import exercise from "../../../Data/exercise";
import Exercise from "./Exercise";
import "./ExerciseList.css";

const ExerciseList = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/stats/grade-counts");
        if (res.data.success) {
          setCounts(res.data.countsByGrade);
        }
      } catch (error) {
        console.error("Lỗi khi lấy số bài tập:", error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="exercise-grid">
      {exercise.map((item) => (
        <Exercise 
          key={item.id} 
          item={item} 
          dynamicCount={counts[item.malop]?.questions} 
        />
      ))}
    </div>
  );
};

export default ExerciseList;
