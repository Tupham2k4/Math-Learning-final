import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuestionPageHeader from "./QuestionPageHeader/QuestionPageHeader";
import QuestionList from "./QuestionList/QuestionList";
import grades from "../../../Data/Grade";
import "./QuestionDetailPage.css";

const QuestionDetailPage = () => {
  // 1 & 10. Kiểm tra và lấy đúng grade từ useParams()
  // Nếu route là /kho-de/lop-1, gradeId có thể mang giá trị "lop-1" hoặc "1"
  const { gradeId, grade: routeGrade } = useParams();
  
  // Tách số 1 ra khỏi chuỗi "lop-1" nếu có
  const paramValue = gradeId || routeGrade || "";
  const gradeString = String(paramValue).replace("lop-", "");
  const grade = parseInt(gradeString, 10) || 1;

  // Lấy ra thông tin cấu hình lớp học từ Data/Grade như trong GradeDetailPage
  const gradeConfig = grades.find((item) => item.malop === grade);
  const themeColor = gradeConfig ? gradeConfig.maunen : "#cde8ce";

  // 4. Kiểm tra state chapters
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [grade]);

  // 9. Viết lại useEffect hoàn chỉnh để fetch chapter đúng, không bị loop vô hạn, chỉ chạy khi grade thay đổi
  useEffect(() => {
    let isMounted = true;

    const fetchChaptersAndExams = async () => {
      setLoading(true);
      setError(null);

      try {
        // 8. Thêm console.log để debug
        console.log("Grade:", grade);

        // 2. Kiểm tra API chapter (Để giống GradeDetailPage, ta bỏ qua encodeURIComponent)
        const fetchUrl = `http://localhost:4000/api/chapters?grade=Lớp ${grade}`;
        const chapterRes = await fetch(fetchUrl);
        const chapterData = await chapterRes.json();
        
        // 3. Kiểm tra dữ liệu backend trả về
        console.log("Chapter response:", chapterData);

        if (!chapterData.success && !chapterData.data && !Array.isArray(chapterData)) {
          throw new Error(chapterData.message || "Lỗi khi tải danh sách chương.");
        }

        // 6. Nếu chapterData.data không tồn tại, fallback sử dụng chapterData
        const rawChapters = chapterData.data || chapterData || [];
        const chapterList = Array.isArray(rawChapters) ? rawChapters : [];

        // Gọi API lấy danh sách đề thi (exams) cho từng chương
        const examsPromises = chapterList.map(async (chapter) => {
          const chId = chapter._id || chapter.id;
          const examRes = await fetch(
            `http://localhost:4000/api/exams/chapter?grade=${grade}&chapterId=${chId}`
          );
          const examData = await examRes.json();
          
          return {
            id: chId,
            title: chapter.title,
            exams: examData.success && Array.isArray(examData.data)
                   ? examData.data.map(exam => ({ ...exam, id: exam._id || exam.id })) 
                   : [],
          };
        });

        const chaptersWithExams = await Promise.all(examsPromises);

        if (!isMounted) return;

        setChapters(chaptersWithExams);
      } catch (err) {
        if (isMounted) setError(err.message || "Không thể kết nối tới máy chủ.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChaptersAndExams();

    return () => {
      isMounted = false; 
    };
  }, [grade]);

  // 8. Thêm console.log để debug
  useEffect(() => {
    console.log("Chapters state:", chapters);
  }, [chapters]);

  return (
    <div className="question-detail-page">
      <div className="question-detail-container">
        <QuestionPageHeader
          grade={grade}
          subtitle={gradeConfig ? gradeConfig.mota : "Chọn đề thi phù hợp với chủ đề để bắt đầu luyện tập ngay hôm nay"}
        />

        {loading && (
          <div style={{ textAlign: "center", padding: "40px", fontSize: "18px" }}>
            Đang tải danh sách chương và đề thi...
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "40px", color: "red", fontSize: "18px" }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* 5. Render chapters map: Component QuestionList nhận vào prop tên là questionSections, ta truyền biến chapters vào */}
            <QuestionList questionSections={chapters} themeColor={themeColor} />
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionDetailPage;
