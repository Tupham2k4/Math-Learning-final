import React, { useState, useEffect } from "react";
import "./WatchVideo.css";

const SidebarVideo = ({ currentVideo, onSelectVideo, gradeNumber }) => {
  const [chapters, setChapters] = useState([]);
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [lessonsMap, setLessonsMap] = useState({});

  useEffect(() => {
    const g = gradeNumber || 12;
    fetch(`http://localhost:4000/api/chapters?grade=Lớp ${g}`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.data && data.data.length > 0) {
               setChapters(data.data);
               if (currentVideo && currentVideo.chapterId) {
                 setActiveChapterId(currentVideo.chapterId);
               } else {
                 setActiveChapterId(data.data[0]._id || data.data[0].id);
               }
            }
        })
        .catch(console.error);
  }, [gradeNumber, currentVideo]);

  useEffect(() => {
    if (!activeChapterId || lessonsMap[activeChapterId]) return;

    fetch(`http://localhost:4000/api/lessons?chapterId=${activeChapterId}`)
      .then(res => res.json())
      .then(data => {
          if (data.success) {
            setLessonsMap(prev => ({ ...prev, [activeChapterId]: data.data }));
          }
      })
      .catch(console.error);
  }, [activeChapterId, lessonsMap]);

  return (
    <div className="sidebar-video">
      <div className="sidebar-video-header">
        <h2>Video bài giảng toán</h2>
        <p className="sidebar-video-subtitle">
          Khám phá video bài giảng chất lượng cao cho lớp {gradeNumber}.
        </p>
      </div>

      <div className="sidebar-video-search">
        <input type="text" placeholder="Tìm kiếm video..." />
      </div>

      <div className="sidebar-video-chapters">
        {chapters.length === 0 ? (
          <p style={{ padding: "0 20px" }}>Đang tải danh sách chương...</p>
        ) : (
          chapters.map((chapter) => (
            <details
              key={chapter._id || chapter.id}
              className="sidebar-video-chapter"
              open={(chapter._id || chapter.id) === activeChapterId}
              onClick={(e) => {
                e.preventDefault();
                setActiveChapterId(chapter._id || chapter.id);
              }}
            >
              <summary className="sidebar-video-chapter-summary">
                <span>{chapter.title}</span>
                <span className="sidebar-video-chapter-count">
                  {(lessonsMap[chapter._id || chapter.id] || []).length} bài
                </span>
              </summary>
              <ul className="sidebar-video-lesson-list">
                {(lessonsMap[chapter._id || chapter.id] || []).map((lesson) => {
                  const isActive = currentVideo && (currentVideo._id || currentVideo.id) === (lesson._id || lesson.id);
                  return (
                    <li
                      key={lesson._id || lesson.id}
                      className={`sidebar-video-lesson-item ${isActive ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectVideo) onSelectVideo(lesson);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="sidebar-video-lesson-title">
                        {lesson.title}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </details>
          ))
        )}
      </div>
    </div>
  );
};

export default SidebarVideo;
