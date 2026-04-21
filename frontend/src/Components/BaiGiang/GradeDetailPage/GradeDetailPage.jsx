import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GradePageHeader from "./GradePageHeader/GradePageHeader";
import grades from "../../../Data/Grade";
import ChapterList from "./ChapterList/ChapterList";
import "./GradeDetailPage.css";

const GradeDetailPage = () => {
  const { gradeId } = useParams();

  // URL dạng /bai-giang/lop-1 → gradeId = "1"
  const gradeNumber = parseInt(gradeId, 10) || 1;

  const gradeConfig = grades.find((item) => item.malop === gradeNumber);
  const themeColor = gradeConfig ? gradeConfig.maunen : "#cde8ce";

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API lấy chương khi tải trang hoặc gradeId thay đổi
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch API 
        const fetchUrl = `http://localhost:4000/api/chapters?grade=Lớp ${gradeNumber}`;
        const response = await fetch(fetchUrl);

        if (!response.ok) {
          throw new Error("Lỗi khi tải dữ liệu từ server.");
        }

        const resData = await response.json();

        if (resData.success && Array.isArray(resData.data)) {
          // Map _id của MongoDB sang id để component ChapterAccordion (chứa lessons) tiếp tục hoạt động nếu cấu trúc cần
          const mappedChapters = resData.data.map((ch) => ({
            ...ch,
            id: ch._id || ch.id, // Đảm bảo đồng bộ cho biến id
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
  }, [gradeNumber]);

  // Hiển thị trạng thái Loading khi gọi API
  if (loading) {
    return (
      <div className="grade-detail-page">
        <div className="grade-detail-container">
          <GradePageHeader
            grade={gradeNumber}
            subtitle="Đang cập nhật nội dung bài giảng..."
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

  // Hiển thị trạng thái Lỗi
  if (error || !chapters.length) {
    return (
      <div className="grade-detail-page">
        <div className="grade-detail-container">
          <GradePageHeader
            grade={gradeNumber}
            subtitle="Đang cập nhật nội dung bài giảng..."
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
              : `Chưa có chương học nào cho lớp ${gradeNumber}.`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grade-detail-page">
      <div className="grade-detail-container">
        <GradePageHeader
          grade={gradeNumber}
          subtitle="Chọn bài giảng và bắt đầu học ngay hôm nay"
        />
        <ChapterList
          chapters={chapters}
          gradeId={gradeNumber}
          themeColor={themeColor}
        />
      </div>
    </div>
  );
};

export default GradeDetailPage;
