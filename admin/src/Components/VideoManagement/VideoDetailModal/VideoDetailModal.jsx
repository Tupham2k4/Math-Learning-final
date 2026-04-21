import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, BookOpen, GraduationCap, PlayCircle, BookText, Image as ImageIcon } from 'lucide-react';
import { renderMathInElement } from 'mathlive';
import './VideoDetailModal.css';

const VideoDetailModal = ({ isOpen, onClose, lesson }) => {
    const [zoomedImg, setZoomedImg] = useState(null);
    const modalBodyRef = useRef(null);

    // Render Math Equations
    useEffect(() => {
        if (isOpen && modalBodyRef.current) {
            renderMathInElement(modalBodyRef.current, {
                TeX: {
                    delimiters: {
                        inline: [['$', '$'], ['\\(', '\\)']],
                        display: [['$$', '$$'], ['\\[', '\\]']]
                    }
                }
            });
        }
    }, [isOpen, lesson]);

    if (!isOpen || !lesson) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN');
    };

    const chapterName = lesson.chapterName || lesson.chapterId?.title || lesson.chapterId?.name || 'Không rõ chương';
    const matchedGrade = String(lesson.grade || lesson.chapterId?.grade || '').replace(/\D/g, '') || '-';
    
    // Thu thập toàn bộ ảnh đính kèm (chủ yếu là thumbnail hoặc từ markdown nếu còn lọt)
    const collectImages = () => {
        const urls = [];
        if (lesson.thumbnail) urls.push(lesson.thumbnail);
        
        // Mặc dù form tạo mới không hỗ trợ markdown, nhưng nếu dữ liệu cũ có thì vớt
        const extract = (text) => {
            if (!text) return;
            const matches = [...text.matchAll(/!\[.*?\]\((.*?)\)/g)];
            matches.forEach(m => urls.push(m[1]));
        };

        if (lesson.content?.mucTieu) extract(lesson.content.mucTieu);
        if (lesson.description) extract(lesson.description);

        return [...new Set(urls)];
    };
    
    const photoGallery = collectImages();
    
    const renderCleanText = (text) => {
        if (!text) return <span className="empty-text">Chưa cập nhật nội dung...</span>;
        
        let clean = text.replace(/!\[.*?\]\((.*?)\)/g, '\n[📸 Xem ảnh đính kèm bên dưới]\n');
        return clean.trim();
    };

    // Lấy link video
    const videoUrl = lesson.videoUrl;
    const description = lesson.description || (lesson.content ? lesson.content.mucTieu : null); // Fallback nếu dữ liệu cũ nằm trong content.mucTieu

    return (
        <div className="video-detail-backdrop">
            <div className="video-detail-container">
                <div className="video-detail-header">
                    <div className="video-title-area">
                        <h2>{lesson.title || lesson.name || "Chưa có tên video bài giảng"}</h2>
                        <div className="video-meta-badges">
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
                    <button onClick={onClose} className="video-close-btn" title="Đóng">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="video-detail-body" ref={modalBodyRef}>
                    <div className="content-section">
                        <h3><PlayCircle size={18} color="#ef4444" /> Đường dẫn Video (Video URL)</h3>
                        <div className="content-text">
                            {videoUrl ? (
                                <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="video-url-link">
                                    <PlayCircle size={18} /> Mở Video trên tab mới
                                </a>
                            ) : (
                                renderCleanText(videoUrl)
                            )}
                            <div style={{ marginTop: '8px', color: '#64748b', fontSize: '14px' }}>
                                Link: {videoUrl || 'Không có link'}
                            </div>
                        </div>
                    </div>

                    <div className="content-section">
                        <h3><BookText size={18} color="#3b82f6" /> Mô tả</h3>
                        <div className="content-text">{renderCleanText(description)}</div>
                    </div>

                    {photoGallery.length > 0 && (
                        <div className="content-section">
                            <h3><ImageIcon size={18} color="#ec4899" /> Ảnh bìa (Thumbnail) ({photoGallery.length})</h3>
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

export default VideoDetailModal;
