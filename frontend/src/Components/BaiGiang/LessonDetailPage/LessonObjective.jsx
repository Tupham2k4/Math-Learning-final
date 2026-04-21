import React from "react";
import checkIcon from "../../Assets/check.png";
import "./LessonObjective.css";
import MathRenderer from "../../Chatbot/MathRenderer/MathRenderer";

const LessonObjective = ({ objectives = [] }) => {
  if (!objectives || objectives.length === 0) return null;

  return (
    <div className="lesson-objective">
      <h3 className="lesson-section-title">Mục tiêu bài học</h3>
      <ul className="lesson-objective-list">
        {objectives.map((text, idx) => (
          <li key={`${idx}-${text}`} className="lesson-objective-item">
            <img className="lesson-objective-icon" src={checkIcon} alt="check" />
            <div style={{ flex: 1 }}>
              <MathRenderer content={text} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonObjective;

