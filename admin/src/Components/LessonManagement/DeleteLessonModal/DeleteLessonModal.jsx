import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import './DeleteLessonModal.css';

const DeleteLessonModal = ({ isOpen, onClose, onConfirm, lesson }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (isOpen && lesson) {
            fetchStats();
        } else {
            setStats(null);
        }
    }, [isOpen, lesson]);

    const fetchStats = async () => {
        setIsLoadingStats(true);
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:4000/api/lessons/${lesson._id}/related`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.success) {
                setStats(res.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải thông số:", error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="delete-lesson-backdrop">
            <div className="delete-lesson-container" style={{maxWidth: '500px'}}>
                <button className="delete-lesson-close" onClick={onClose} disabled={isDeleting || isLoadingStats}>
                    <X size={20} />
                </button>
                
                <div className="delete-lesson-content">
                    <div className="delete-lesson-icon-bg" style={{ backgroundColor: '#fee2e2' }}>
                        <AlertTriangle size={32} color="#ef4444" />
                    </div>
                    
                    <h3 className="delete-lesson-title">Cảnh báo xóa bộ dữ liệu Lesson</h3>
                    <p className="delete-lesson-text" style={{ textAlign: 'left', marginTop: '16px', lineHeight: '1.6' }}>
                        Lesson này đang được sử dụng trong bài giảng, video bài giảng hoặc bài tập. Nếu tiếp tục xóa, toàn bộ dữ liệu liên quan cũng sẽ bị <strong>xóa theo</strong>. Bạn có chắc chắn muốn tiếp tục không?
                    </p>

                    {isLoadingStats ? (
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                            <Loader2 className="spinner" size={24} color="#64748b" />
                        </div>
                    ) : stats && (
                        <div style={{ marginTop: '20px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', textAlign: 'left' }}>
                            <p style={{ fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Dữ liệu sẽ bị xóa bao gồm:</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <li>{stats.baiGiangCount || 0} bài giảng</li>
                                <li>{stats.videoBaiGiangCount || 0} video bài giảng</li>
                                <li>{stats.baiTapCount || 0} bài tập</li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="delete-lesson-actions" style={{ marginTop: '32px' }}>
                    <button 
                        className="delete-lesson-btn-cancel" 
                        onClick={onClose}
                        disabled={isDeleting || isLoadingStats}
                    >
                        Hủy
                    </button>
                    <button 
                        className="delete-lesson-btn-confirm" 
                        onClick={handleConfirm}
                        disabled={isDeleting || isLoadingStats}
                        style={{ backgroundColor: '#ef4444' }}
                    >
                        {isDeleting ? <Loader2 size={18} className="spinner" /> : 'Xóa tất cả'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteLessonModal;
