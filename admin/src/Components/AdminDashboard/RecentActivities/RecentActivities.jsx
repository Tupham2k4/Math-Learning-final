import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle } from 'lucide-react';
import './RecentActivities.css';

const RecentActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentActivities = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/stats');
                if (response.data.success && response.data.recentActivities) {
                    setActivities(response.data.recentActivities);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching recent activities:", err);
                setLoading(false);
            }
        };

        fetchRecentActivities();
    }, []);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit', minute: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).format(date);
    };

    const getScoreClass = (score) => {
        if (score >= 8) return 'score-high';
        if (score >= 5) return 'score-medium';
        return 'score-low';
    };

    return (
        <div className="recent-activities-container">
            <div className="activities-header">
                <h3 className="activities-title">Hoạt động gần đây</h3>
                <button className="view-all-btn">Xem tất cả</button>
            </div>

            <div className="activities-list">
                {loading ? (
                    <div className="activities-loading">Đang tải dữ liệu...</div>
                ) : activities.length === 0 ? (
                    <div className="activities-empty">Chưa có hoạt động nào được ghi nhận</div>
                ) : (
                    activities.map((activity, index) => (
                        <div className="activity-card" key={activity._id || index}>
                            <div className="activity-avatar">
                                {activity.userName ? activity.userName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="activity-content">
                                <p className="activity-desc">
                                    <span className="activity-user">{activity.userName || 'Người dùng ẩn danh'}</span>
                                    {' vừa hoàn thành bài '}
                                    <span className="activity-lesson">{activity.lessonTitle || 'Bài kiểm tra'}</span>
                                </p>
                                <div className="activity-meta">
                                    <span className="meta-tag">{activity.grade?.includes('Khối') ? activity.grade : `Khối ${activity.grade || 'N/A'}`}</span>
                                    <span className="meta-time">
                                        <Clock size={12} /> {formatTime(activity.createdAt)}
                                    </span>
                                </div>
                            </div>
                            <div className="activity-result">
                                <div className={`score-badge ${getScoreClass(activity.score)}`}>
                                    {activity.score?.toFixed(1) || '0.0'} điểm
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivities;
