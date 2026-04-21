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
          to={`/bai-giang/lop/${gradeId}/bai/${lesson.id}`}
          className="lesson-btn btn-xem-bai-giang"
        >
          Xem bài giảng
        </Link>
      </div>
    </div>
  );
};

export default LessonItem;
