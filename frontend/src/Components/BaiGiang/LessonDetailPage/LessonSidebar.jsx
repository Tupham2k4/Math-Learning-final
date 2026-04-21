import React from "react";
import { Link } from "react-router-dom";
import "./LessonSidebar.css";

const LessonSidebar = ({ grade, outline = [], nextLessons = [] }) => {
  return (
    <aside className="lesson-sidebar">
      <div className="sidebar-card">
        <h3 className="sidebar-title">Nội dung bài học</h3>
        <ol className="sidebar-outline">
          {outline.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="sidebar-link"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(item.id);
                  if (el)
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className="sidebar-card">
        <h3 className="sidebar-title">Bài học tiếp theo</h3>
        <div className="sidebar-next">
          {nextLessons.map((l) => (
            <Link
              key={l._id || l.id}
              to={`/bai-giang/lop/${grade}/bai/${l._id || l.id}`}
              className="sidebar-next-item"
            >
              {l.title}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LessonSidebar;
