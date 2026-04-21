import React, { useState, useEffect } from 'react';
import { getChatbotStats } from '../ChatbotService/adminChatService';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { MessageCircle, Users, Clock, Loader2, AlertCircle } from 'lucide-react';
import './ChatbotStatsCards.css';

const ChatbotStatsCards = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getChatbotStats();
                if (data.success) {
                    setStats(data);
                } else {
                    setError('Không thể tải dữ liệu thống kê.');
                }
            } catch (err) {
                setError(err.message || 'Lỗi khi tải thống kê.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="stats-cards-loading">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p>Đang tải thống kê...</p>
        </div>
    );

    if (error) return (
        <div className="stats-cards-error">
            <AlertCircle size={32} color="#ef4444" />
            <p>{error}</p>
        </div>
    );

    if (!stats) return null;

    const { totalQuestions, totalUsers, avgResponseTime, questionsPerDay } = stats;

    return (
        <div className="chatbot-stats-container">
            <div className="stats-cards-grid">
                {/* Total Questions Card */}
                <div className="chatbot-stat-card purple-card">
                    <div className="stat-icon-wrapper">
                        <MessageCircle size={28} className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-title">Tổng lượt hỏi chatbot</p>
                        <h3 className="stat-value">{totalQuestions}</h3>
                    </div>
                </div>

                {/* Total Users Card */}
                <div className="chatbot-stat-card green-card">
                    <div className="stat-icon-wrapper">
                        <Users size={28} className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-title">Số người sử dụng</p>
                        <h3 className="stat-value">{totalUsers}</h3>
                    </div>
                </div>

                {/* Average Response Time Card */}
                <div className="chatbot-stat-card blue-card">
                    <div className="stat-icon-wrapper">
                        <Clock size={28} className="stat-icon" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-title">Thời gian phản hồi (TB)</p>
                        <h3 className="stat-value">{avgResponseTime} ms</h3>
                    </div>
                </div>
            </div>

            {/* Questions Per Day Chart */}
            <div className="stats-chart-section">
                <h3>Thống Kê Lượt Hỏi (14 Ngày Gần Nhất)</h3>
                <div className="chart-wrapper">
                    {questionsPerDay && questionsPerDay.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={questionsPerDay} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="date" 
                                    tickFormatter={(tick) => {
                                        const d = new Date(tick);
                                        return `${d.getDate()}/${d.getMonth()+1}`;
                                    }}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis 
                                    tick={{ fill: '#64748b', fontSize: 12 }} 
                                    axisLine={false} 
                                    tickLine={false}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    labelFormatter={(label) => `Ngày: ${label}`}
                                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                />
                                <Bar dataKey="count" name="Số câu hỏi" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-chart">Chưa có dữ liệu thống kê chat</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatbotStatsCards;
