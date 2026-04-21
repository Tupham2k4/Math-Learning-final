import React from "react";
import { Link } from "react-router-dom";
import "./GradeCard.css";
import document from "../../Assets/document.png";
const GradeCard = ({ item, dynamicCount }) => {
  return (
    <Link to={`/bai-giang/lop/${item.malop}`} className="grade-card-link">
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
            <img src={document} alt="lesson" className="lesson-icon" />
            <span>{dynamicCount !== undefined ? dynamicCount : item.sobai} bài giảng</span>
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
    </Link>
  );
};

export default GradeCard;
