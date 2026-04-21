import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ExercisePageHeader from "./ExercisePageHeader/ExercisePageHeader";
import ChapterList from "./ChapterList/ChapterList";
import exercise from "../../../Data/exercise";
import "./ExerciseDetailPage.css";

const ExerciseDetailPage = () => {
  // Lấy gradeId từ URL params
  const { gradeId } = useParams();
  const grade = parseInt(gradeId) || 1;

  console.log("Loading ExerciseDetailPage for grade:", grade);
  const gradeConfig = exercise.find((item) => item.malop === grade);
  const themeColor = gradeConfig ? gradeConfig.maunen : "#eaf8ed";

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch API
        const fetchUrl = `http://localhost:4000/api/chapters?grade=Lớp ${grade}`;
        const response = await fetch(fetchUrl);

        if (!response.ok) {
          throw new Error("Lỗi khi tải dữ liệu từ server.");
        }

        const resData = await response.json();

        if (resData.success && Array.isArray(resData.data)) {
          // Map _id của MongoDB sang id để đồng bộ giao diện cũ
          const mappedChapters = resData.data.map((ch) => ({
            ...ch,
            id: ch._id || ch.id,
          }));
          setChapters(mappedChapters);
        } else {
          setChapters([]);
        }
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi hệ thống");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [grade]);



  if (loading) {
    return (
      <div className="exercise-detail-page">
        <div className="exercise-detail-container">
          <ExercisePageHeader
            grade={grade}
            subtitle="Đang cập nhật nội dung..."
            backgroundColor={themeColor}
          />
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              fontSize: "18px",
              color: "#666",
            }}
          >
            Đang tải dữ liệu chương...
          </div>
        </div>
      </div>
    );
  }

  if (error || !chapters.length) {
    return (
      <div className="exercise-detail-page">
        <div className="exercise-detail-container">
          <ExercisePageHeader
            grade={grade}
            subtitle="Đang cập nhật nội dung..."
            backgroundColor={themeColor}
          />
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              fontSize: "18px",
              color: "#666",
            }}
          >
            {error
              ? `Lỗi: ${error}`
              : `Đang cập nhật nội dung cho lớp ${grade}...`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-detail-page">
      <div className="exercise-detail-container">
        <ExercisePageHeader
          grade={grade}
          subtitle="Chọn bài học và bắt đầu luyện tập ngay hôm nay"
          backgroundColor={themeColor}
        />
        <ChapterList
          chapters={chapters}
          gradeId={grade}
          themeColor={themeColor}
        />
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
