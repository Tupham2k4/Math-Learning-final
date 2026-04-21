import React from "react";
import { Link } from "react-router-dom";
import "./LessonItem.css";

const LessonItem = ({ lesson, gradeId, chapterId }) => {
  return (
    <div className="lesson-item">
      <div className="lesson-info">
        <span className="lesson-title">{lesson.title}</span>
      </div>
      <div className="lesson-buttons">
        <Link
          to={`/bai-tap/lop/${gradeId}/trac-nghiem/${lesson.id}`}
          className="lesson-btn btn-trac-nghiem"
        >
          Trắc nghiệm
        </Link>
        <Link
          to={`/bai-tap/lop/${gradeId}/tu-luan/${lesson.id}`}
          className="lesson-btn btn-tu-luan"
        >
          Tự luận
        </Link>
      </div>
    </div>
  );
};

export default LessonItem;
