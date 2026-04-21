import React from "react";
import { Link } from "react-router-dom";
import document from "../../Assets/document.png";
import "../../BaiGiang/GradeCard/GradeCard.css";

const QuestionCard = ({ exam }) => {
  if (!exam) return null;

  return (
    <Link to={`/kho-de/dac-biet/${exam.id}`} className="grade-card-link">
      <div className="grade-card">
        <div
          className="grade-card-top"
          style={{
            backgroundColor: exam.maunen,
            border: `1px solid ${exam.maunen}`,
          }}
        >
          <span className="grade-badge">
            {typeof exam.malop === "number" ? `Lớp ${exam.malop}` : exam.malop}
          </span>
          <h3>{exam.tenlop}</h3>
          <p>{exam.mota}</p>
        </div>
        <div className="grade-card-bottom">
          <div className="grade-lessons">
            <img src={document} alt="icon" className="lesson-icon" />
            <span>{exam.sode} đề thi</span>
          </div>
          <div className="grade-button">
            <button
              className="btn basic"
              style={{ backgroundColor: exam.maunut }}
            >
              Xem ngay
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;
