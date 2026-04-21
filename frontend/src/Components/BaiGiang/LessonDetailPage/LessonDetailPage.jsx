import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import LessonPageHeader from "./LessonPageHeader";
import LessonSidebar from "./LessonSidebar";
import MathMarkdown from "../../Common/MathMarkdown";
import LessonObjective from "./LessonObjective";
import QuizQuestion from "./QuizQuestion";
import "./LessonDetailPage.css";

const LessonDetailPage = () => {
  const { gradeId, lessonId } = useParams();
  const grade = parseInt(gradeId, 10) || 1;

  const [lesson, setLesson] = useState(null);
  const [nextLessons, setNextLessons] = useState([]);
  const [outline, setOutline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dữ liệu của bài giảng từ API backend
  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:4000/api/lessons/${lessonId}`,
        );
        if (!response.ok) {
          throw new Error("Không thể tải thông tin bài giảng.");
        }

        const resData = await response.json();
        if (resData.success) {
          setLesson(resData.data);
        } else {
          throw new Error(resData.message || "Lỗi dữ liệu.");
        }
      } catch (err) {
        setError(err.message || "Lỗi hệ thống");
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLessonDetail();
    }
  }, [lessonId]);

  const [prevLesson, setPrevLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);

  useEffect(() => {
    // Build outline for sidebar navigation
    setOutline([
      { id: "mucTieu", title: "Mục tiêu" },
      { id: "concept", title: "Khái niệm" },
      { id: "examples", title: "Ví dụ minh họa" },
      { id: "note", title: "Ghi nhớ" },
    ]);

    // Fetch other lessons in the same chapter to populate next/prev lists
    const fetchLessonsInChapter = async () => {
      try {
        if (!lesson?.chapterId) return;
        const resp = await fetch(
          `http://localhost:4000/api/lessons?chapterId=${lesson.chapterId}`,
        );
        if (!resp.ok) return;
        const resData = await resp.json();
        if (!resData.success) return;

        const lessons = (resData.data || [])
          .slice()
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        // set all other lessons for listing
        setNextLessons(
          lessons.filter((l) => (l._id || l.id) !== (lesson._id || lesson.id)),
        );

        // compute prev/next relative to current
        const currentId = lesson._id || lesson.id;
        const idx = lessons.findIndex((l) => (l._id || l.id) === currentId);
        setPrevLesson(idx > 0 ? lessons[idx - 1] : null);
        setNextLesson(
          idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null,
        );
      } catch (err) {
        // ignore silently
      }
    };

    fetchLessonsInChapter();
  }, [lesson]);
  // Xử lý mục tiêu bài học có thể là string hoặc array, chuẩn hoá thành array để hiển thị
  const objectives = useMemo(() => {
    const raw = lesson?.content?.mucTieu; //Lấy mục tiêu từ content.mucTieu, có thể là string hoặc array
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      const lines = raw
        .split(/\r?\n/) //Tách chuỗi thành mảng theo dòng
        .map((s) => s.replace(/^[\-\*\d\.\)\s]+/, "").trim()) // Loại bỏ các ký tự đầu dòng như "-", "*", "1.", "2)", v.v... và trim khoảng trắng
        .filter(Boolean); // Loại bỏ các dòng trống
      return lines.length ? lines : [raw]; // Nếu sau khi tách và lọc vẫn có dòng nào đó, trả về mảng các dòng, ngược lại trả về mảng chứa chuỗi gốc
    }
    return [String(raw)]; // Nếu là kiểu dữ liệu khác, ép về string và trả về mảng chứa nó
  }, [lesson]);

  // Trạng thái Error và Loading state
  if (loading) {
    return (
      <div className="lesson-detail-page">
        <div
          style={{
            padding: "100px",
            textAlign: "center",
            fontSize: "18px",
            color: "#666",
          }}
        >
          Đang tải chi tiết bài giảng...
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="lesson-detail-page">
        <div
          style={{
            padding: "100px",
            textAlign: "center",
            fontSize: "18px",
            color: "red",
          }}
        >
          {error ? `Lỗi: ${error}` : "Bài giảng không tồn tại hoặc đã bị xoá."}
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-detail-page">
      <LessonPageHeader grade={grade} lessonTitle={lesson.title} />

      <div className="lesson-banner">
        <div className="lesson-banner-inner">
          <h2 className="lesson-banner-title">{lesson.title}</h2>
          <p className="lesson-banner-desc">
            Khám phá và học hỏi kiến thức mới hôm nay.
          </p>
        </div>
      </div>

      <div className="lesson-container">
        <div className="lesson-grid">
          <main className="lesson-main">
            <section className="lesson-card" id="mucTieu">
              <h2 className="lesson-title">{lesson.title}</h2>
              <br />
              <LessonObjective objectives={objectives} />
            </section>

            <section className="lesson-card" id="concept">
              <h3 className="lesson-section-title">1. Khái niệm</h3>
              <div className="lesson-text">
                <MathMarkdown
                  content={lesson.content?.khaiNiem || "Đang cập nhật..."}
                />
              </div>
            </section>

            <section className="lesson-card" id="examples">
              <div className="quiz-card">
                <h3 className="lesson-section-title">2. Ví dụ minh hoạ</h3>
                <div className="lesson-example-text">
                  <MathMarkdown
                    content={lesson.content?.viDu || "Chưa có ví dụ phân tích."}
                  />
                </div>
                {lesson.content?.quiz && (
                  <QuizQuestion quiz={lesson.content.quiz} />
                )}
              </div>
            </section>

            <section className="lesson-card" id="note">
              <h3 className="lesson-section-title">3. Ghi nhớ</h3>
              <div
                className="lesson-text"
                style={{ fontWeight: "bold", color: "#2E7D32" }}
              >
                <MathMarkdown
                  content={
                    lesson.content?.ghiNho || "Đừng quên ôn bài thật kĩ nhé!"
                  }
                />
              </div>
            </section>

            <div className="lesson-nav">
              <div className="lesson-nav-left">
                {prevLesson ? (
                  <Link
                    className="lesson-nav-btn"
                    to={`/bai-giang/lop/${grade}/bai/${prevLesson._id || prevLesson.id}`} //Đường dẫn đến bài trước, sử dụng _id hoặc id tuỳ có sẵn
                  >
                    ← Bài trước
                  </Link>
                ) : (
                  <button className="lesson-nav-btn disabled" type="button">
                    ← Bài trước
                  </button>
                )}
              </div>
              <div className="lesson-nav-right">
                {nextLesson ? (
                  <Link
                    className="lesson-nav-btn primary"
                    to={`/bai-giang/lop/${grade}/bai/${nextLesson._id || nextLesson.id}`} //Đường dẫn đến bài tiếp theo, sử dụng _id hoặc id tuỳ có sẵn
                  >
                    Bài tiếp theo →
                  </Link>
                ) : (
                  <button className="lesson-nav-btn disabled" type="button">
                    Bài tiếp theo →
                  </button>
                )}
              </div>
            </div>
          </main>

          <LessonSidebar
            grade={grade}
            outline={outline}
            nextLessons={nextLessons}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;
