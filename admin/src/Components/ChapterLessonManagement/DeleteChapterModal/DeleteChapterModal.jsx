import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import './DeleteChapterModal.css';

const DeleteChapterModal = ({ isOpen, onClose, onConfirm, chapter }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (isOpen && chapter) {
            fetchStats();
        } else {
            setStats(null);
        }
    }, [isOpen, chapter]);

    const fetchStats = async () => {
        setIsLoadingStats(true);
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:4000/api/chapters/${chapter._id}/related`, {
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
        <div className="delete-chapter-backdrop">
            <div className="delete-chapter-container">
                <button className="delete-chapter-close" onClick={onClose} disabled={isDeleting || isLoadingStats}>
                    <X size={20} />
                </button>
                
                <div className="delete-chapter-content">
                    <div className="delete-chapter-icon-bg" style={{ backgroundColor: '#fff7ed' }}>
                        <AlertTriangle size={36} color="#f97316" />
                    </div>
                    
                    <h3 className="delete-chapter-title">Xác nhận xóa Chương</h3>
                    <p className="delete-chapter-text" style={{ textAlign: 'left', marginTop: '16px', lineHeight: '1.6' }}>
                        Chương này đang chứa nhiều dữ liệu liên quan. Nếu tiếp tục xóa, toàn bộ lesson, bài giảng, video bài giảng, bài tập và kho đề bên trong cũng sẽ bị <strong>xóa theo</strong>. Bạn có chắc chắn muốn tiếp tục không?
                    </p>

                    {isLoadingStats ? (
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <Loader2 className="spinner" size={24} color="#64748b" />
                        </div>
                    ) : stats && (
                        <div style={{ marginTop: '20px', width: '100%', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', textAlign: 'left' }}>
                            <p style={{ fontWeight: '600', marginBottom: '8px', color: '#334155' }}>Dữ liệu sắp bị xóa bao gồm:</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: '#475569', paddingLeft: '8px' }}>
                                <div>• {stats.lessonsCount || 0} lesson</div>
                                <div>• {stats.baiGiangCount || 0} bài giảng</div>
                                <div>• {stats.videoBaiGiangCount || 0} video bài giảng</div>
                                <div>• {stats.baiTapCount || 0} bài tập</div>
                                <div>• {stats.khoDeCount || 0} kho đề</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="delete-chapter-actions" style={{ marginTop: '32px' }}>
                    <button 
                        className="delete-chapter-btn-cancel" 
                        onClick={onClose}
                        disabled={isDeleting || isLoadingStats}
                    >
                        Hủy
                    </button>
                    <button 
                        className="delete-chapter-btn-confirm" 
                        onClick={handleConfirm}
                        disabled={isDeleting || isLoadingStats}
                        style={{ backgroundColor: '#f97316' }}
                    >
                        {isDeleting ? <Loader2 size={18} className="spinner" /> : 'Xóa tất cả'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteChapterModal;
