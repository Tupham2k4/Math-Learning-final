import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, ImagePlus, Loader2 } from 'lucide-react';
import axios from 'axios';
import './CreateLessonModal.css';

// Component Textarea hỗ trợ tải ảnh Markdown lên Cloudinary
const MarkdownTextarea = ({ value, onChange, placeholder, isTall }) => {
    const textareaRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUploadClick = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setIsUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            try {
                // Gọi API đẩy ảnh lên thư mục Cloudinary
                const res = await axios.post('http://localhost:4000/api/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (res.data.success) {
                    const imageUrl = res.data.image_url;
                    
                    // Chèn mã Markdown tại con trỏ (Cursor)
                    const textarea = textareaRef.current;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const before = value.substring(0, start);
                    const after = value.substring(end);
                    
                    const markdownSyntax = `\n![Hình minh hoạ bài học](${imageUrl})\n`;
                    const newText = before + markdownSyntax + after;
                    
                    onChange(newText);

                    // Trả focus
                    setTimeout(() => {
                        textarea.focus();
                        textarea.setSelectionRange(start + markdownSyntax.length, start + markdownSyntax.length);
                    }, 0);
                }
            } catch (err) {
                console.error("Lỗi upload ảnh markdown:", err);
                alert("Tải ảnh thất bại. Có lỗi xảy ra ở hệ thống Upload.");
            } finally {
                setIsUploading(false);
            }
        };
        fileInput.click();
    };

    return (
        <div className="markdown-editor-wrapper">
            <div className="markdown-toolbar">
                <span className="markdown-hint">Upload ảnh vào nội dung bài giảng</span>
                <button 
                    type="button" 
                    className="markdown-upload-btn" 
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    title="Tải ảnh lên máy chủ"
                >
                    {isUploading ? <Loader2 size={16} className="spinner" /> : <ImagePlus size={16} color="#34A853" />}
                    {isUploading ? 'Đang tải...' : 'Tải Ảnh Lên'}
                </button>
            </div>
            <textarea
                ref={textareaRef}
                className={`lesson-textarea ${isTall ? 'tall-textarea' : ''}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
};

const CreateLessonModal = ({ isOpen, onClose, onSubmit, chapters = [] }) => {
    // Basic fields
    const [title, setTitle] = useState('');
    const [grade, setGrade] = useState('');
    const [chapterId, setChapterId] = useState('');
    
    // Content fields
    const [mucTieu, setMucTieu] = useState('');
    const [khaiNiem, setKhaiNiem] = useState('');
    const [ghiNho, setGhiNho] = useState('');
    const [baiTap, setBaiTap] = useState(''); 
    
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

        if (!title.trim()) return setError('Vui lòng nhập tên bài giảng.');
        if (!grade) return setError('Vui lòng chọn khối lớp.');
        if (!chapterId) return setError('Vui lòng chọn chương học.');

        setIsSubmitting(true);
        try {
            const formData = {
                title,
                grade,
                chapterId,
                thumbnailFile: thumbnail, 
                content: {
                    mucTieu,
                    khaiNiem,
                    ghiNho,
                    viDu: baiTap 
                }
            };
            
            await onSubmit(formData);
            handleClose();
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi thêm bài giảng.');
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setTitle('');
        setGrade('');
        setChapterId('');
        setMucTieu('');
        setKhaiNiem('');
        setGhiNho('');
        setBaiTap('');
        setThumbnail(null);
        setImagePreview(null);
        setError('');
        setIsSubmitting(false);
        if (onClose) onClose();
    };

    return (
        <div className="lesson-modal-backdrop">
            <div className="lesson-modal-container">
                <div className="lesson-modal-header">
                    <h2>Thêm bài giảng mới</h2>
                    <button onClick={handleClose} className="lesson-close-btn">
                        <X size={24} />
                    </button>
                </div>

                <div className="lesson-modal-body">
                    {error && <div className="lesson-modal-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="lesson-form-grid">
                        <div className="lesson-form-col">
                            <div className="lesson-form-group">
                                <label>Tên bài giảng <span className="required">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Phép cộng có nhớ"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="lesson-form-row">
                                <div className="lesson-form-group">
                                    <label>Khối lớp <span className="required">*</span></label>
                                    <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                                        <option value="">Chọn khối lớp</option>
                                        {grades.map(g => (
                                            <option key={g} value={g}>Khối {g}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="lesson-form-group">
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

                            <div className="lesson-form-group">
                                <label>Mục tiêu bài học</label>
                                <textarea
                                    className="lesson-textarea"
                                    placeholder="Học sinh hiểu được..."
                                    value={mucTieu}
                                    onChange={(e) => setMucTieu(e.target.value)}
                                />
                            </div>

                            <div className="lesson-form-group">
                                <label>Ảnh bìa ngoài bảng (Thumbnail)</label>
                                <div className="lesson-image-upload">
                                    <input 
                                        type="file" 
                                        id="thumbnailUpload" 
                                        accept="image/*"
                                        onChange={handleImageChange} 
                                        className="hidden-input"
                                    />
                                    <label htmlFor="thumbnailUpload" className="upload-box">
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

                        <div className="lesson-form-col">
                            <div className="lesson-form-group">
                                <label>Khái niệm</label>
                                <MarkdownTextarea 
                                    value={khaiNiem}
                                    onChange={setKhaiNiem}
                                    placeholder="Các khái niệm và định nghĩa..."
                                    isTall={true}
                                />
                            </div>
                            
                            <div className="lesson-form-group">
                                <label>Ghi nhớ</label>
                                <MarkdownTextarea 
                                    value={ghiNho}
                                    onChange={setGhiNho}
                                    placeholder="Những ý chính cần nhớ..."
                                    isTall={false}
                                />
                            </div>

                            <div className="lesson-form-group">
                                <label>Bài tập vận dụng</label>
                                <MarkdownTextarea 
                                    value={baiTap}
                                    onChange={setBaiTap}
                                    placeholder="Nội dung bài tập thực hành..."
                                    isTall={false}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="lesson-modal-footer">
                    <button className="lesson-btn-cancel" onClick={handleClose} disabled={isSubmitting}>
                        Hủy
                    </button>
                    <button className="lesson-btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Đang thêm...' : 'Thêm bài giảng'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateLessonModal;
