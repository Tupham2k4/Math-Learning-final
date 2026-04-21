import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import './CreateVideoModal.css';

const CreateVideoModal = ({ isOpen, onClose, onSubmit, chapters = [] }) => {
    // Basic fields
    const [title, setTitle] = useState('');
    const [grade, setGrade] = useState('');
    const [chapterId, setChapterId] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [description, setDescription] = useState('');
    
    // Image fields
    const [thumbnail, setThumbnail] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
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
        setChapterId('');
    }, [grade]);

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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) return setError('Vui lòng nhập tên video bài giảng.');
        if (!grade) return setError('Vui lòng chọn khối lớp.');
        if (!chapterId) return setError('Vui lòng chọn chương học.');
        if (!videoUrl.trim()) return setError('Vui lòng nhập đường dẫn video (videoUrl).');

        setIsSubmitting(true);
        try {
            const formData = {
                title,
                grade,
                chapterId,
                videoUrl,
                description,
                thumbnailFile: thumbnail, 
            };
            
            await onSubmit(formData);
            handleClose();
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi thêm video bài giảng.');
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setTitle('');
        setGrade('');
        setChapterId('');
        setVideoUrl('');
        setDescription('');
        setThumbnail(null);
        setImagePreview(null);
        setError('');
        setIsSubmitting(false);
        if (onClose) onClose();
    };

    return (
        <div className="video-modal-backdrop">
            <div className="video-modal-container" style={{ width: '700px' }}>
                <div className="video-modal-header">
                    <h2>Thêm video bài giảng mới</h2>
                    <button onClick={handleClose} className="video-close-btn" type="button">
                        <X size={24} />
                    </button>
                </div>

                <div className="video-modal-body">
                    {error && <div className="video-modal-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="video-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="video-form-col">
                            <div className="video-form-group">
                                <label>Tên video bài giảng <span className="required">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Phép cộng có nhớ"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="video-form-row">
                                <div className="video-form-group">
                                    <label>Khối lớp <span className="required">*</span></label>
                                    <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                                        <option value="">Chọn khối lớp</option>
                                        {grades.map(g => (
                                            <option key={g} value={g}>Khối {g}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="video-form-group">
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

                            <div className="video-form-group">
                                <label>Đường dẫn Video (Video URL) <span className="required">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: https://www.youtube.com/watch?v=..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                />
                            </div>

                            <div className="video-form-group">
                                <label>Mô tả video bài giảng</label>
                                <textarea
                                    className="video-textarea"
                                    style={{ minHeight: '100px' }}
                                    placeholder="Nhập mô tả ngắn gọn về bài giảng"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="video-form-group">
                                <label>Ảnh bìa (Thumbnail)</label>
                                <div className="video-image-upload">
                                    <input 
                                        type="file" 
                                        id="thumbnailUpload" 
                                        accept="image/*"
                                        onChange={handleImageChange} 
                                        className="hidden-input"
                                    />
                                    <label htmlFor="thumbnailUpload" className="upload-box" style={{ height: '160px' }}>
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="preview-image" />
                                        ) : (
                                            <div className="upload-placeholder">
                                                <ImageIcon size={32} color="#9ca3af" />
                                                <p>Nhấn để chọn ảnh</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="video-modal-footer">
                    <button className="video-btn-cancel" type="button" onClick={handleClose} disabled={isSubmitting}>
                        Hủy
                    </button>
                    <button className="video-btn-submit" type="button" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Đang thêm...' : 'Thêm video'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateVideoModal;
