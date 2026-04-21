import React, { useState } from 'react';
import { X, Calendar, BookOpen, GraduationCap, Target, Lightbulb, BookText, FileSignature, Image as ImageIcon } from 'lucide-react';
import './LessonDetailModal.css';

const LessonDetailModal = ({ isOpen, onClose, lesson }) => {
    const [zoomedImg, setZoomedImg] = useState(null);

    if (!isOpen || !lesson) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN');
    };

    const chapterName = lesson.chapterName || lesson.chapterId?.title || lesson.chapterId?.name || 'Không rõ chương';
    const matchedGrade = String(lesson.grade || lesson.chapterId?.grade || '').replace(/\D/g, '') || '-';
    
    // Thu thập toàn bộ ảnh từ thuộc tính thumbnail và trong Markdown của Content
    const collectImages = () => {
        const urls = [];
        if (lesson.thumbnail) urls.push(lesson.thumbnail);
        
        const extract = (text) => {
            if (!text) return;
            // Capture URLs inside markdown ![alt](url)
            const matches = [...text.matchAll(/!\[.*?\]\((.*?)\)/g)];
            matches.forEach(m => urls.push(m[1]));
        };

        if (lesson.content) {
            extract(lesson.content.mucTieu);
            extract(lesson.content.khaiNiem);
            extract(lesson.content.ghiNho);
            extract(lesson.content.viDu);
        }
        // Loại bỏ các url trùng nếu có
        return [...new Set(urls)];
    };
    const photoGallery = collectImages();
    const renderCleanText = (text) => {
        if (!text) return <span className="empty-text">Chưa cập nhật nội dung...</span>;
        
        let clean = text.replace(/!\[.*?\]\((.*?)\)/g, '\n[📸 Xem ảnh đính kèm bên dưới]\n');
        return clean.trim();
    };

    return (
        <div className="lesson-detail-backdrop">
            <div className="lesson-detail-container">
                <div className="lesson-detail-header">
                    <div className="lesson-title-area">
                        <h2>{lesson.title || lesson.name || "Chưa có tên bài giảng"}</h2>
                        <div className="lesson-meta-badges">
                            <span className="detail-badge badge-blue">
                                <BookOpen size={16} /> Thuộc chương: {chapterName}
                            </span>
                            <span className="detail-badge badge-green">
                                <GraduationCap size={16} /> Khối {matchedGrade}
                            </span>
                            <span className="detail-badge badge-gray">
                                <Calendar size={16} /> Tạo: {formatDate(lesson.createdAt)}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="lesson-close-btn" title="Đóng">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="lesson-detail-body">
                    <div className="content-section">
                        <h3><Target size={18} color="#f59e0b" /> Mục tiêu bài học</h3>
                        <div className="content-text">{renderCleanText(lesson.content?.mucTieu)}</div>
                    </div>

                    <div className="content-section">
                        <h3><BookText size={18} color="#3b82f6" /> Khái niệm</h3>
                        <div className="content-text">{renderCleanText(lesson.content?.khaiNiem)}</div>
                    </div>

                    <div className="content-section">
                        <h3><Lightbulb size={18} color="#10b981" /> Ghi nhớ</h3>
                        <div className="content-text">{renderCleanText(lesson.content?.ghiNho)}</div>
                    </div>

                    <div className="content-section">
                        <h3><FileSignature size={18} color="#8b5cf6" /> Bài tập vận dụng</h3>
                        <div className="content-text">{renderCleanText(lesson.content?.viDu || lesson.content?.baiTap)}</div>
                    </div>

                    {photoGallery.length > 0 && (
                        <div className="content-section">
                            <h3><ImageIcon size={18} color="#ec4899" /> Khu vực Hình ảnh đính kèm ({photoGallery.length})</h3>
                            <div className="detail-photo-grid">
                                {photoGallery.map((url, index) => (
                                    <div 
                                        key={index} 
                                        className="detail-photo-item"
                                        onClick={() => setZoomedImg(url)}
                                        title="Nhấn để phóng to"
                                    >
                                        <img src={url} alt={`attachment-${index}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay Phóng to cảnh */}
            {zoomedImg && (
                <div className="zoom-overlay" onClick={() => setZoomedImg(null)} title="Nhấn ra ngoài để đóng">
                    <img src={zoomedImg} alt="Zoomed" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
};

export default LessonDetailModal;
