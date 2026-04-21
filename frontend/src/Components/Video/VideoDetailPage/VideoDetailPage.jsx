import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VideoDetailPage.css";

const VideoDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  
  const gradeNumber = Number(state.grade || 12);

  const [chapters, setChapters] = useState([]);
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // 1. Fetch Chapters for the selected Grade
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoadingChapters(true);
        const res = await fetch(`http://localhost:4000/api/chapters?grade=Lớp ${gradeNumber}`);
        const data = await res.json();
        
        if (data.success && data.data && data.data.length > 0) {
          setChapters(data.data);
          setActiveChapterId(data.data[0]._id || data.data[0].id);
        } else {
          setChapters([]);
          setActiveChapterId(null);
        }
      } catch (error) {
        console.error("Lỗi khi tải chương:", error);
      } finally {
        setLoadingChapters(false);
      }
    };
    
    fetchChapters();
  }, [gradeNumber]);

  // 2. Fetch Lessons for the selected Chapter
  useEffect(() => {
    const fetchLessons = async () => {
      if (!activeChapterId) return;
      try {
        setLoadingLessons(true);
        const res = await fetch(`http://localhost:4000/api/lessons?chapterId=${activeChapterId}`);
        const data = await res.json();
        
        if (data.success && data.data) {
          setLessons(data.data);
        } else {
          setLessons([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải bài học:", error);
      } finally {
        setLoadingLessons(false);
      }
    };

    fetchLessons();
  }, [activeChapterId]);

  const activeChapter = chapters.find(c => (c._id || c.id) === activeChapterId);
  const chapterTitleParts = activeChapter?.title?.split(":") || [];
  const chapterLabel = chapterTitleParts[0] || `Chương 1`;
  const chapterHeading = chapterTitleParts.slice(1).join(":").trim() || activeChapter?.title || "Chưa có tiêu đề";

  return (
    <div className="video-page-wrapper">
      <div className="video-page-inner">
        {/* Left sidebar */}
        <aside className="video-sidebar">
          <div className="video-sidebar-header">
            <h2>
              Video bài giảng {state.grade ? `lớp ${state.grade}` : "lớp 12"}
            </h2>
            <p className="video-sidebar-subtitle">
              Lộ trình học theo chương, được thiết kế cho kì thi THPT QG.
            </p>
          </div>

          <div className="video-sidebar-search">
            <input type="text" placeholder="Tìm kiếm bài giảng, chủ đề..." />
          </div>

          <div className="video-sidebar-chapters">
            {loadingChapters ? (
              <p style={{ padding: "0 20px" }}>Đang tải chương...</p>
            ) : chapters.length === 0 ? (
              <p style={{ padding: "0 20px" }}>Chưa có chương học nào.</p>
            ) : (
              chapters.map((chapter) => (
                <details
                  key={chapter._id || chapter.id}
                  className="video-chapter"
                  open={(chapter._id || chapter.id) === activeChapterId}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveChapterId(chapter._id || chapter.id);
                  }}
                >
                  <summary className="video-chapter-summary" style={{ cursor: "pointer" }}>
                    <span>{chapter.title}</span>
                  </summary>
                  <ul className="video-lesson-list">
                    {/* The list will populate when this chapter is active */}
                    {(chapter._id || chapter.id) === activeChapterId && lessons.map((lesson) => (
                      <li
                        key={lesson._id || lesson.id}
                        className="video-lesson-item"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                           e.stopPropagation();
                           navigate(`/video-bai-giang/xem/${lesson._id || lesson.id}`, { state: { video: lesson, grade: gradeNumber, activeChapterId: activeChapterId } });
                        }}
                      >
                        <div className="video-lesson-main">
                          <span className="video-lesson-title">
                            {lesson.title}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </details>
              ))
            )}
          </div>
        </aside>

        {/* Right content area */}
        <section className="video-content">
          <header className="video-chapter-header">
            <div>
              <p className="video-chapter-label">{activeChapter ? chapterLabel : "Đang tải..."}</p>
              <h1>{activeChapter ? chapterHeading : "Vui lòng chọn một chương học"}</h1>
              {activeChapter?.description && (
                <p className="video-chapter-description">
                  {activeChapter.description}
                </p>
              )}
            </div>
            <div className="video-chapter-meta">
              <span>{lessons.length} bài giảng</span>
            </div>
          </header>

          <div className="video-filter-bar">
            <div className="video-filter-search">
              <input type="text" placeholder="Tìm video trong chương này..." />
            </div>
          </div>

          <div className="video-detail-grid">
            {loadingLessons ? (
              <p>Đang tải bài giảng...</p>
            ) : lessons.length === 0 ? (
              <p>Chương này chưa có bài giảng nào.</p>
            ) : (
              lessons.map((lesson) => (
                <article key={lesson._id || lesson.id} className="video-detail-card" onClick={() => navigate(`/video-bai-giang/xem/${lesson._id || lesson.id}`, { state: { video: lesson, grade: gradeNumber } })} style={{ cursor: "pointer" }}>
                  <div className="video-detail-thumbnail">
                    {lesson.thumbnail ? (
                       <img
                         src={lesson.thumbnail}
                         alt={lesson.title}
                         className="video-detail-thumbnail-img"
                       />
                    ) : (
                       <div className="video-detail-thumbnail-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e9ecef', color: '#666', fontSize: '14px', fontWeight: 'bold' }}>
                         Không có ảnh
                       </div>
                    )}
                    <div className="video-detail-thumbnail-overlay" />
                    <div className="video-detail-thumbnail-play">
                      <span className="play-icon">▶</span>
                    </div>
                  </div>

                  <div className="video-detail-card-body">
                    <h3 className="video-detail-card-title">{lesson.title}</h3>
                    <div className="video-detail-card-meta">
                      <div className="video-meta-item">
                        <span>Video mở rộng</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="video-primary-btn"
                    >
                      Bắt đầu xem
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default VideoDetailPage;
