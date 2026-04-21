import React, { useState, useEffect } from 'react';
import { getAllChatLogs, deleteChatLog } from '../ChatbotService/adminChatService';
import './AdminChatLogs.css';
import { Eye, Trash2, AlertCircle, Loader2, Search, X } from 'lucide-react';
import MathRenderer from '../MathRenderer/MathRenderer';

const AdminChatLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLog, setSelectedLog] = useState(null); // Để hiển thị modal chi tiết

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await getAllChatLogs();
            if (data.success) {
                setLogs(data.chatLogs);
            } else {
                setError('Không thể tải danh sách log.');
            }
        } catch (err) {
            setError(err.message || 'Lỗi khi tải dữ liệu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
            try {
                const rs = await deleteChatLog(id);
                if (rs.success) {
                    setLogs(logs.filter(log => log._id !== id));
                }
            } catch (err) {
                alert('Lỗi khi xóa: ' + (err.message || err));
            }
        }
    };

    const truncate = (text, maxLength = 60) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredLogs = logs.filter(log => 
        log.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.userId?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.userId?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="admin-chat-logs-loading">
            <Loader2 className="animate-spin text-blue-500" size={40} />
            <p>Đang tải dữ liệu từ Gemini...</p>
        </div>
    );

    if (error) return (
        <div className="admin-chat-logs-error">
            <AlertCircle size={40} color="#ff4d4f" />
            <h3>Đã có lỗi xảy ra</h3>
            <p>{error}</p>
            <button className="btn-retry" onClick={fetchLogs}>Thử lại</button>
        </div>
    );

    return (
        <div className="admin-chat-logs-container">
            <div className="admin-chat-logs-header">
                <div>
                    <h1>Lịch sử Chatbot AI</h1>
                    <p className="subtitle">Quản lý và giám sát phản hồi từ Gemini AI</p>
                </div>
                <div className="search-bar">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên, email hoặc câu hỏi..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-wrapper card-shadow">
                <table className="admin-chat-logs-table">
                    <thead>
                        <tr>
                            <th>Người dùng</th>
                            <th>Câu hỏi (Prompt)</th>
                            <th>Phản hồi (AI)</th>
                            <th>Phản hồi (ms)</th>
                            <th>Thời gian</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log._id}>
                                <td className="user-cell">
                                    <div className="user-avatar">
                                        {(log.userId?.name || 'K')[0]}
                                    </div>
                                    <div className="user-info">
                                        <span className="user-name">{log.userId?.name || 'Khách Vãng Lai'}</span>
                                        <span className="user-email">{log.userId?.email || 'N/A'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="content-cell" title={log.prompt}>
                                        {truncate(log.prompt)}
                                    </div>
                                </td>
                                <td>
                                    <div className="content-cell" title={log.response}>
                                        {truncate(log.response)}
                                    </div>
                                </td>
                                <td>
                                    <span className={`time-badge ${log.responseTime > 5000 ? 'slow' : 'fast'}`}>
                                        {log.responseTime}ms
                                    </span>
                                </td>
                                <td>{formatDate(log.createdAt)}</td>
                                <td className="actions">
                                    <button 
                                        className="btn-action view" 
                                        onClick={() => setSelectedLog(log)}
                                        title="Xem chi tiết"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button 
                                        className="btn-action delete" 
                                        onClick={() => handleDelete(log._id)}
                                        title="Xóa log"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLogs.length === 0 && (
                    <div className="empty-state">
                        <p>Không tìm thấy dữ liệu nào phù hợp.</p>
                    </div>
                )}
            </div>

            {/* Modal Chi tiết */}
            {selectedLog && (
                <div className="log-modal-overlay" onClick={() => setSelectedLog(null)}>
                    <div className="log-modal-content card-shadow" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Chi tiết lượt chat</h3>
                            <button className="close-btn" onClick={() => setSelectedLog(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="info-group">
                                <label>Câu hỏi của {selectedLog.userId?.name || 'Người dùng'}:</label>
                                <div className="text-box prompt-box">{selectedLog.prompt}</div>
                            </div>
                            <div className="info-group">
                                <label>Phản hồi từ AI (Gemini):</label>
                                <div className="text-box response-box">
                                    <MathRenderer content={selectedLog.response} />
                                    <div className="usage-info">
                                        Tokens: <span>{selectedLog.tokensUsed || 'Unknown'}</span> | 
                                        Phản hồi: <span>{selectedLog.responseTime}ms</span>
                                    </div>
                                </div>
                            </div>
                            <div className="meta-info">
                                <span><strong>ID hội thoại:</strong> {selectedLog.conversationId?._id || 'N/A'}</span>
                                <span><strong>Thời gian:</strong> {formatDate(selectedLog.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminChatLogs;
