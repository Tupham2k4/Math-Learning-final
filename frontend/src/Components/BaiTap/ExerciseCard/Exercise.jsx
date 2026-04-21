import React from "react";
import { Link } from "react-router-dom";
import "./Exercise.css";
import document from "../../Assets/document.png";
import clock from "../../Assets/clock.png";

const Exercise = ({ item }) => {
  return (
    <div className="exercise-card">
      <div
        className="exercise-card-top"
        style={{ backgroundColor: item.maunen }}
      >
        <span className="exercise-badge">Lớp {item.malop}</span>
        <h3>{item.tenlop}</h3>
        <p>{item.mota}</p>
      </div>
      <div className="exercise-card-bottom">
        <div className="exercise-lessons">
          <img src={document} alt="" className="lesson-icon"></img>
          <span>{item.sobai} bài</span>
        </div>
        <div className="exercise-lessons">
          <img src={clock} alt="" className="lesson-icon"></img>
          <span>Mức độ: {item.mucdo}</span>
        </div>
        <div className="exercise-button">
          <Link
            to={`/bai-tap/lop/${item.malop}`}
            className="btn-exercise color"
            style={{ backgroundColor: item.maunut }}
          >
            Bắt đầu làm bài
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
