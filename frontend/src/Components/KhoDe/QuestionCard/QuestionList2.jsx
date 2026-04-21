import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import examquestions2 from "../../../Data/ExamQuestions2";
import documentIcon from "../../Assets/document.png";
import "../../BaiGiang/GradeCard/GradeCard.css";
import "./QuestionList.css";

const categoryMap = {
  1: "vao10",
  2: "thpt",
  3: "thi_thu",
  4: "hsg",
};

const QuestionList2 = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchExams = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:4000/api/exams/special?category=${selectedCategory}`
        );
        const data = await response.json();

        if (data.success) {
          setExams(data.data);
        } else {
          setError(data.message || "Lỗi khi lấy dữ liệu.");
        }
      } catch (err) {
        setError("Không thể kết nối đến máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [selectedCategory]);

  const handleCategoryClick = (id) => {
    const categoryQuery = categoryMap[id];
    if (categoryQuery) {
      if (selectedCategory === categoryQuery) {
        // Toggle đóng lại nếu click lần 2
        setSelectedCategory(null);
      } else {
        setSelectedCategory(categoryQuery);
      }
    }
  };

  const handleExamClick = (examId) => {
    navigate(`/exam/${examId}`);
  };

  return (
    <div className="special-exams-container">
      {/* Lưới 4 Thẻ Category Đặc biệt */}
      <div className="examquestions-grid-2">
        {examquestions2.map((item) => {
          const isSelected = selectedCategory === categoryMap[item.id];
          return (
            <div
              key={item.id}
              className="grade-card-link"
              style={{ cursor: "pointer" }}
              onClick={() => handleCategoryClick(item.id)}
            >
              <div
                className="grade-card"
                style={
                  isSelected
                    ? {
                        transform: "translateY(-6px)",
                        boxShadow: "0 14px 30px rgba(0, 0, 0, 0.12)",
                        border: "2px solid #5cb65f",
                      }
                    : {}
                }
              >
                <div
                  className="grade-card-top"
                  style={{
                    backgroundColor: item.maunen,
                    border: `1px solid ${item.maunen}`,
                  }}
                >
                  <span className="grade-badge">
                    {typeof item.malop === "number"
                      ? `Lớp ${item.malop}`
                      : item.malop}
                  </span>
                  <h3>{item.tenlop}</h3>
                  <p>{item.mota}</p>
                </div>
                <div className="grade-card-bottom">
                  <div className="grade-lessons">
                    <img
                      src={documentIcon}
                      alt="icon"
                      className="lesson-icon"
                    />
                    <span>{item.sode} chủ đề</span>
                  </div>
                  <div className="grade-button">
                    <button
                      className="btn basic"
                      style={{ backgroundColor: item.maunut }}
                    >
                      {isSelected ? "Đóng lại" : "Khám phá"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hiển thị danh sách đề thi (nếu đang chọn một danh mục) */}
      {selectedCategory && (
        <div
          className="special-exams-list"
          style={{ padding: "0 32px 32px 32px" }}
        >
          <div
            style={{
              padding: "24px",
              backgroundColor: "#f9f9f9",
              borderRadius: "16px",
            }}
          >
            <h2 style={{ color: "#34A853", marginBottom: "20px" }}>
              Danh sách đề thi
            </h2>

            {loading && <p>Đang tải dữ liệu...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && exams.length === 0 && (
              <p>Chưa có đề thi nào trong danh mục này.</p>
            )}

            {!loading && !error && exams.length > 0 && (
              <div
                className="exams-list-container"
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                {exams.map((exam) => (
                  <div
                    key={exam._id}
                    className="exam-list-item"
                    style={{
                      padding: "16px 20px",
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid #eee",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "translateX(5px)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "translateX(0)")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <img
                        src={documentIcon}
                        alt="doc"
                        style={{ width: "24px", height: "24px" }}
                      />
                      <h4
                        style={{ margin: 0, fontSize: "17px", color: "#333" }}
                      >
                        {exam.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleExamClick(exam._id)}
                      style={{
                        padding: "8px 20px",
                        backgroundColor: "#5cb65f",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#469749")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#5cb65f")
                      }
                    >
                      Làm bài
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionList2;
