import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";
import "./RelatedExams.css";

export default function RelatedDocuments({ currentExam }) {
  const { fetchData, loading, error } = useFetch();
  const [relatedDocs, setRelatedDocs] = useState([]);

  useEffect(() => {
    if (!currentExam) return;

    let isMounted = true;

    const fetchRelated = async () => {
      try {
        let endpoint = "";
        
        // Dựa vào thuộc tính của đề hiện tại để quyết định gọi API nào
        if (currentExam.type === "chapter" && currentExam.grade && currentExam.chapterId) {
          const chapterIdString = typeof currentExam.chapterId === "object" ? currentExam.chapterId._id : currentExam.chapterId;
          endpoint = `/api/exams/chapter?grade=${currentExam.grade}&chapterId=${chapterIdString}`;
        } else if (currentExam.type === "special" && currentExam.category) {
          endpoint = `/api/exams/special?category=${currentExam.category}`;
        }        
        if (!endpoint) return;

        const res = await fetchData(endpoint);
        
        if (isMounted && res.success) {
          // Lọc bỏ document hiện tại đang xem
          const filtered = res.data.filter(doc => doc._id !== currentExam._id);
          
          // Lấy ngẫu nhiên hoặc cắt lấy tối đa 4 bài
          setRelatedDocs(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error("Lỗi khi tải đề thi liên quan", err);
      }
    };

    fetchRelated();

    return () => { isMounted = false; };
  }, [currentExam, fetchData]);

  if (!loading && relatedDocs.length === 0) return null; // Ẩn layout nếu không có bài viết liên quan

  return (
    <div className="related-wrapper" style={{ marginTop: "40px", width: "100%" }}>
      <div className="related-header">
        <div className="related-bar"></div>
        <h2 style={{ fontSize: "24px", color: "#333", margin: "0 0 0 16px" }}>Đề thi liên quan</h2>
      </div>

      {loading ? (
        <div style={{ padding: "20px 0", color: "#666" }}>Đang tải đề thi liên quan...</div>
      ) : error ? (
        <div style={{ padding: "20px 0", color: "#d32f2f" }}>Chưa thể lấy đề thi liên quan.</div>
      ) : (
        <div 
          className="related-grid" 
          style={{
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
            gap: "24px", 
            marginTop: "24px"
          }}
        >
          {relatedDocs.map((doc) => {
            const dateStr = new Date(doc.createdAt).toLocaleDateString("vi-VN");
            return (
              <Link 
                to={`/exam/${doc._id}`} 
                key={doc._id} 
                className="related-card" 
                style={{
                  display: "block", 
                  textDecoration: "none", 
                  backgroundColor: "#fff", 
                  borderRadius: "12px", 
                  overflow: "hidden", 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }} 
                onMouseOver={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                }} 
                onMouseOut={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ height: "160px", backgroundColor: "#f5f5f5", overflow: "hidden" }}>
                  <img
                    src={doc.thumbnail || "https://placehold.co/600x400/f8fafc/64748b?text=To%C3%A1n+H%E1%BB%8Dc"}
                    alt={doc.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="related-content" style={{ padding: "16px" }}>
                  <h3 style={{ 
                    margin: "0 0 12px 0", 
                    fontSize: "16px", 
                    color: "#333", 
                    lineHeight: "1.4", 
                    height: "44px", 
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden" 
                  }}>
                    {doc.title}
                  </h3>
                  <div className="related-date" style={{ fontSize: "14px", color: "#666", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="clock">🕒</span>
                    {dateStr}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
