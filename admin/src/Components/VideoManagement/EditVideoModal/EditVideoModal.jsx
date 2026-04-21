import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Trash2 } from 'lucide-react';
import './EditVideoModal.css';

const EditVideoModal = ({ isOpen, onClose, selectedLesson, onSubmit, chapters = [] }) => {
    // Editable Basic properties
    const [title, setTitle] = useState('');
    const [grade, setGrade] = useState('');
    const [chapterId, setChapterId] = useState('');
    
    // Editable Media/Content fields
    const [videoUrl, setVideoUrl] = useState('');
    const [description, setDescription] = useState('');
    
    // Image fields
    const [thumbnail, setThumbnail] = useState(null); // File mới nếu upload
    const [imagePreview, setImagePreview] = useState(null); // Preview ảnh mới hoặc ảnh cũ
    const [removeThumbnail, setRemoveThumbnail] = useState(false); // Đánh dấu xóa ảnh cũ
    
    // UI state
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const grades = Array.from({ length: 12 }, (_, i) => i + 1);

    const filteredChapters = chapters.filter(c => {
        if (!grade) return false;
        const chapterGrade = String(c.grade).replace(/\D/g, '');
        return chapterGrade === String(grade);
    });

    useEffect(() => {
        if (isOpen && selectedLesson) {
            setTitle(selectedLesson.title || selectedLesson.name || '');
            
            // Xử lý grade (vd: "Khối 1" -> "1")
            const g = String(selectedLesson.grade || selectedLesson.chapterId?.grade || '').replace(/\D/g, '');
            setGrade(g);
            
            // Xử lý chapterId
            const cId = typeof selectedLesson.chapterId === 'object' && selectedLesson.chapterId !== null 
                ? selectedLesson.chapterId._id 
                : selectedLesson.chapterId;
            setChapterId(cId || '');
            
            setVideoUrl(selectedLesson.videoUrl || '');
            
            // Lấy description từ logic fallback
            const desc = selectedLesson.description || (selectedLesson.content ? selectedLesson.content.mucTieu : '');
            setDescription(desc || '');

            if (selectedLesson.thumbnail) {
                setImagePreview(selectedLesson.thumbnail);
            } else {
                setImagePreview(null);
            }
            
            setThumbnail(null);
            setRemoveThumbnail(false);
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen, selectedLesson]);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setRemoveThumbnail(false);
        }
    };

    const handleRemoveImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setThumbnail(null);
        setImagePreview(null);
        setRemoveThumbnail(true);
        // Reset file input value
        const fileInput = document.getElementById('editThumbnailUpload');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        setIsSubmitting(true);
        try {
            const formData = {
                title,
                grade,
                chapterId,
                videoUrl,
                description,
                thumbnailFile: thumbnail,
                removeThumbnail: removeThumbnail
            };
            
            await onSubmit(selectedLesson._id, formData);
            handleClose();
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi cập nhật video bài giảng.');
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setError('');
        setIsSubmitting(false);
        if (onClose) onClose();
    };

    return (
        <div className="edit-video-modal-backdrop">
            <div className="edit-video-modal-container">
                <div className="edit-video-modal-header">
                    <h2>Chỉnh sửa video bài giảng</h2>
                    <button onClick={handleClose} className="edit-video-close-btn" type="button">
                        <X size={24} />
                    </button>
                </div>

                <div className="edit-video-modal-body">
                    {error && <div className="edit-video-modal-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="edit-video-form-grid">
                        <div className="edit-video-form-col">
                            {/* Editable Context */}
                            <div className="edit-video-form-group">
                                <label>Tên video bài giảng <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    placeholder="Sửa tên bài giảng..."
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="edit-video-form-group">
                                    <label>Khối lớp <span className="required">*</span></label>
                                    <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                                        <option value="">Chọn khối lớp</option>
                                        {grades.map(g => (
                                            <option key={g} value={g}>Khối {g}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="edit-video-form-group">
                                    <label>Thuộc chương <span className="required">*</span></label>
                                    <select 
                                        value={chapterId} 
                                        onChange={(e) => setChapterId(e.target.value)}
                                        disabled={!grade}
                                    >
                                        <option value="">Chọn chương</option>
                                        {filteredChapters.map(c => (
                                            <option key={c._id} value={c._id}>
                                                {c.title || c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px dashed #e5e7eb', margin: '12px 0' }} />

                            {/* Editable Fields */}
                            <div className="edit-video-form-group">
                                <label>Đường dẫn Video (Video URL)</label>
                                <input
                                    type="text"
                                    placeholder="Điền URL video (xóa trắng nếu muốn gỡ video)"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                />
                            </div>

                            <div className="edit-video-form-group">
                                <label>Mô tả video bài giảng</label>
                                <textarea
                                    className="edit-video-textarea"
                                    placeholder="Nhập mô tả ngắn gọn..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="edit-video-form-group">
                                <label>Ảnh bìa (Thumbnail)</label>
                                <div className="edit-video-image-upload">
                                    <input 
                                        type="file" 
                                        id="editThumbnailUpload" 
                                        accept="image/*"
                                        onChange={handleImageChange} 
                                        className="hidden-input"
                                    />
                                    
                                    {imagePreview ? (
                                        <div className="upload-box" style={{ cursor: 'default' }}>
                                            <button 
                                                className="remove-image-btn" 
                                                onClick={handleRemoveImage}
                                                title="Xóa ảnh cũ"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <img src={imagePreview} alt="Preview" className="preview-image" />
                                        </div>
                                    ) : (
                                        <label htmlFor="editThumbnailUpload" className="upload-box">
                                            <div className="upload-placeholder">
                                                <ImageIcon size={32} color="#9ca3af" />
                                                <p>Nhấn để chọn ảnh mới</p>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="edit-video-modal-footer">
                    <button className="edit-video-btn-cancel" type="button" onClick={handleClose} disabled={isSubmitting}>
                        Hủy
                    </button>
                    <button className="edit-video-btn-submit" type="button" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật video'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditVideoModal;
