import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, Calendar, FileText } from "lucide-react";
import RelatedExams from "./RelatedExams/RealetedExams";
import "./ExamDetalPage.css";

const ExamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchExam = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:4000/api/exams/${id}`);
        const data = await res.json();

        if (data.success) {
          setExam(data.data);
        } else {
          setError(data.message || "Không tìm thấy thông tin đề thi.");
        }
      } catch (err) {
        setError("Lỗi kết nối đến máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExam();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="exam-detail-loading">
        <div className="spinner"></div>
        <p>Đang tải tài liệu, vui lòng đợi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-detail-error">
        <h2>Oops!</h2>
        <p>{error}</p>
        <button className="btn-back" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  if (!exam) return null;

  return (
    <div className="exam-detail-page">
      <div className="exam-detail-inner">
        {/* Phần Header */}
        <div className="exam-header">
          <div className="exam-info">
            <h1>{exam.title}</h1>
            <div className="exam-tags">
              {exam.type === "special" && (
                <span className="tag special-tag">Đề thi Đặc biệt</span>
              )}
              {exam.type === "chapter" && (
                <span className="tag chapter-tag">Lớp {exam.grade}</span>
              )}
            </div>
          </div>

          <div className="exam-actions">
            <a
              href={exam.pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="btn-download"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Tải xuống PDF
            </a>
          </div>
        </div>

        {/* Phần Nội dung (PDF + Info Card) */}
        <div className="exam-content-area">
          <div className="exam-pdf-wrapper">
            <iframe
              src={exam.pdfUrl}
              title={exam.title}
              className="exam-pdf-iframe"
            >
              Trình duyệt của bạn không hỗ trợ hiển thị PDF trực tiếp. Vui lòng
              tải xuống để xem.
            </iframe>
          </div>

          <div className="exam-info-card">
            <h3 className="info-card-title" title={exam.title}>{exam.title}</h3>
            {exam.description && (
              <p className="info-card-desc" title={exam.description}>{exam.description}</p>
            )}
            
            <div className="info-card-details">
              {exam.grade && (
                <div className="info-item">
                  <div className="info-label">
                    <BookOpen size={16} /> Lớp
                  </div>
                  <div className="info-value">{exam.grade}</div>
                </div>
              )}
              <div className="info-item">
                <div className="info-label">
                  <Calendar size={16} /> Ngày tạo
                </div>
                <div className="info-value">
                  {exam.createdAt ? new Date(exam.createdAt).toLocaleDateString("vi-VN") : "Đang cập nhật"}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <FileText size={16} /> Số trang
                </div>
                <div className="info-value">
                  {exam.totalPages || "Đang cập nhật"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Khối chuyên dụng: Đề thi liên quan (cùng chương / category) */}
        <RelatedExams currentExam={exam} />
      </div>
    </div>
  );
};

export default ExamDetailPage;
