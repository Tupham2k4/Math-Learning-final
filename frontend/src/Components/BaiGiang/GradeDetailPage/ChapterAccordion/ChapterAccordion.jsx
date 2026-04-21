import React, { useState, useEffect } from "react";
import LessonItem from "../LessonItem/LessonItem";
import clock1 from "../../../Assets/clock1.png";
import "./ChapterAccordion.css";

const ChapterAccordion = ({
  chapter,
  gradeId,
  defaultOpen = false,
  themeColor,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Khai báo state lưu lessons, loading, báo lỗi và check xem đã gọi call API chưa
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Chỉ gọi API 1 lần duy nhất khi accordion được mở ra
  useEffect(() => {
    if (isOpen && !hasFetched) {
      const fetchLessons = async () => {
        try {
          setLoading(true);
          setError(null);

          // Lấy duy nhất bài học của chính chapter.id hiện tại
          const response = await fetch(
            `http://localhost:4000/api/lessons?chapterId=${chapter.id}`
          );

          if (!response.ok) {
            throw new Error("Lỗi tải bài học từ server");
          }

          const resData = await response.json();

          if (resData.success && Array.isArray(resData.data)) {
            // Map _id sang id để props LessonItem hiển thị đúng
            const mappedLessons = resData.data.map((l) => ({
              ...l,
              id: l._id || l.id,
            }));
            setLessons(mappedLessons);
          } else {
            setLessons([]);
          }
        } catch (err) {
          setError(err.message || "Lỗi hệ thống");
        } finally {
          setLoading(false);
          setHasFetched(true);
        }
      };

      fetchLessons();
    }
  }, [isOpen, hasFetched, chapter.id]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`chapter-accordion ${isOpen ? "active" : ""}`}>
      <button
        className="chapter-header"
        onClick={toggleAccordion}
        style={{ "--header-bg": themeColor || "#eaf8ed" }}
      >
        <div className="chapter-header-content">
          <div className="chapter-icon">
            <img src={clock1} alt="Chapter" className="chapter-clock-icon" />
          </div>
          <span className="chapter-title">{chapter.title}</span>
        </div>

        <div className={`chapter-arrow ${isOpen ? "rotated" : ""}`}>
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

      <div className={`chapter-content ${isOpen ? "expanded" : ""}`}>
        <div className="chapter-lessons">
          {loading ? (
            <div className="loading-lessons" style={{ padding: "10px 20px", color: "#666" }}>
              Đang tải bài học...
            </div>
          ) : error ? (
            <div className="error-lessons" style={{ padding: "10px 20px", color: "red" }}>
              Lỗi: {error}
            </div>
          ) : lessons && lessons.length > 0 ? (
            lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                gradeId={gradeId}
                chapterId={chapter.id}
              />
            ))
          ) : (
            <div className="no-lessons">Chưa có bài học trong chương này</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterAccordion;
