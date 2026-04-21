import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QuestionAccordion.css";
import documentIcon from "../../../Assets/document1.png";

const QuestionAccordion = ({ chapter, exams, defaultOpen = false, themeColor }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const navigate = useNavigate();

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const openViewer = (examId) => {
    navigate(`/exam/${examId}`);
  };

  // Tránh crash nếu dữ liệu bị thiếu
  const safeExams = Array.isArray(exams) ? exams : [];

  return (
    <div className={`question-accordion ${isOpen ? "active" : ""}`}>
      <button 
        className="question-accordion-header" 
        onClick={toggleAccordion}
        style={{ "--header-bg": themeColor || "#eaf8ed" }}
      >
        <div className="question-header-content">
          <div className="question-icon">
            <img src={documentIcon} alt="Document" className="question-clock-icon" />
          </div>
          <h3 className="question-title">{chapter?.title || "Chương không xác định"}</h3>
        </div>
        <div className={`question-arrow ${isOpen ? "rotated" : ""}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      <div className={`question-content ${isOpen ? "expanded" : ""}`}>
        <div className="question-list-items">
          {safeExams.length === 0 ? (
            <div className="question-item" style={{ justifyContent: "center", color: "#666", backgroundColor: "transparent" }}>
              <span className="question-item-title" style={{ fontStyle: "italic", fontWeight: "normal" }}>
                Chưa có đề thi nào trong chương này.
              </span>
            </div>
          ) : (
            safeExams.map((exam) => (
              <div key={exam._id || exam.id} className="question-item">
                <span className="question-item-title">{exam.title || "Đề thi trống"}</span>
                <button
                  className="view-now-btn"
                  onClick={() => openViewer(exam._id || exam.id)}
                >
                  Xem ngay
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionAccordion;
