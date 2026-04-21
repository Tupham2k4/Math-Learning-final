import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import grades from "../../../Data/Grade";
import document from "../../Assets/document.png";
import "../../BaiGiang/GradeCard/GradeCard.css";
import "./QuestionList.css";

const QuestionList = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/stats/grade-counts");
        if (res.data.success) {
          setCounts(res.data.countsByGrade);
        }
      } catch (error) {
        console.error("Lỗi data:", error);
      }
    };
    fetchCounts();
  }, []);

  const handleNavigate = (grade) => {
    navigate(`/kho-de/lop-${grade}`);
  };

  return (
    <div className="examquestions-grid">
      {grades.map((item) => (
        <div
          key={item.id}
          className="grade-card-link"
          style={{ cursor: "pointer" }}
          onClick={() => handleNavigate(item.malop)}
        >
          <div className="grade-card">
            <div
              className="grade-card-top"
              style={{
                backgroundColor: item.maunen,
                border: `1px solid ${item.maunen}`,
              }}
            >
              <span className="grade-badge">Lớp {item.malop}</span>
              <h3>{item.tenlop}</h3>
              <p>{item.mota}</p>
            </div>
            <div className="grade-card-bottom">
              <div className="grade-lessons">
                <img src={document} alt="icon" className="lesson-icon" />
                <span>{counts[item.malop]?.exams !== undefined ? counts[item.malop]?.exams : item.sobai} đề luyện tập</span>
              </div>
              <div className="grade-button">
                <button
                  className="btn basic"
                  style={{ backgroundColor: item.maunut }}
                >
                  Xem ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
