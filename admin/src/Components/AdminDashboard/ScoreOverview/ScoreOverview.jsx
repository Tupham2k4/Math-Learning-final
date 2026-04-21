import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, TrendingUp, TrendingDown, Medal } from 'lucide-react';
import './ScoreOverview.css';

const ScoreOverview = () => {
    const [stats, setStats] = useState({
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScoreStats = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/stats');
                if (response.data.success) {
                    setStats({
                        averageScore: response.data.averageScore.toFixed(2),
                        highestScore: response.data.highestScore.toFixed(2),
                        lowestScore: response.data.lowestScore.toFixed(2),
                        passRate: response.data.passRate
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching score overview:", err);
                setLoading(false);
            }
        };

        fetchScoreStats();
    }, []);

    if (loading) {
        return <div className="score-overview-loading">Đang tải biểu mẫu...</div>;
    }

    return (
        <div className="score-overview-container">
            <h3 className="score-overview-title">Chỉ số chi tiết</h3>
            <div className="score-overview-list">
                
                {/* Điểm trung bình */}
                <div className="score-card bg-green-light">
                    <div className="score-card-header">
                        <Target className="score-icon text-green" size={16} />
                        <span className="score-label">Điểm trung bình</span>
                    </div>
                    <div className="score-value text-green">{stats.averageScore}</div>
                </div>

                {/* Điểm cao nhất */}
                <div className="score-card bg-blue-light">
                    <div className="score-card-header">
                        <TrendingUp className="score-icon text-blue" size={16} />
                        <span className="score-label">Điểm cao nhất</span>
                    </div>
                    <div className="score-value text-blue">{stats.highestScore}</div>
                </div>

                {/* Điểm thấp nhất */}
                <div className="score-card bg-orange-light">
                    <div className="score-card-header">
                        <TrendingDown className="score-icon text-orange" size={16} />
                        <span className="score-label">Điểm thấp nhất</span>
                    </div>
                    <div className="score-value text-orange">{stats.lowestScore}</div>
                </div>

                {/* Tỉ lệ đạt */}
                <div className="score-card bg-gray-light">
                    <div className="score-card-header">
                        <Medal className="score-icon text-dark-blue" size={16} />
                        <span className="score-label">Tỷ lệ đạt</span>
                    </div>
                    <div className="score-value text-dark-blue">{stats.passRate}%</div>
                </div>
            </div>
        </div>
    );
};

export default ScoreOverview;
