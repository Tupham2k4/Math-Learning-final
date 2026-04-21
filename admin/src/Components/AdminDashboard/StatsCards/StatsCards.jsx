import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText, Database, BookOpen, Video, TrendingUp } from 'lucide-react';
import './StatsCards.css';

const StatsCards = () => {
    const [stats, setStats] = useState({
        userCount: 0,
        questionCount: 0,
        lessonCount: 0,
        examCount: 0,
        videoCount: 0,
        averageScore: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/stats');
                if (response.data.success) {
                    setStats({
                        userCount: response.data.userCount,
                        questionCount: response.data.questionCount,
                        lessonCount: response.data.lessonCount,
                        examCount: response.data.examCount,
                        videoCount: response.data.videoCount,
                        averageScore: response.data.averageScore
                    });
                } else {
                    setError("Could not load stats");
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setError("Failed to fetch data from backend");
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cardsData = [
        {
            title: "Học sinh",
            value: stats.userCount,
            icon: <Users size={22} />,
            colorClass: "bg-green-light text-green"
        },
        {
            title: "Bài tập",
            value: stats.questionCount,
            icon: <FileText size={22} />,
            colorClass: "bg-teal-light text-teal"
        },
        {
            title: "Kho đề",
            value: stats.examCount,
            icon: <Database size={22} />,
            colorClass: "bg-blue-light text-blue"
        },
        {
            title: "Bài giảng",
            value: stats.lessonCount,
            icon: <BookOpen size={22} />,
            colorClass: "bg-cyan-light text-cyan"
        },
        {
            title: "Video bài giảng",
            value: stats.videoCount,
            icon: <Video size={22} />,
            colorClass: "bg-yellow-light text-yellow"
        },
        {
            title: "Điểm trung bình",
            value: `${stats.averageScore}`,
            suffix: "/10",
            icon: <TrendingUp size={22} />,
            colorClass: "bg-green-main-light text-green-main"
        }
    ];

    if (loading) {
        return <div className="stats-cards-loading">Đang tải dữ liệu thống kê...</div>;
    }

    if (error) {
        return <div className="stats-cards-error">{error}</div>;
    }

    return (
        <div className="stats-cards-container">
            {cardsData.map((card, index) => (
                <div className="stat-card" key={index}>
                    <div className={`stat-card-icon-container ${card.colorClass}`}>
                        {card.icon}
                    </div>
                    <div className="stat-card-info">
                        <div className="stat-card-value-container">
                            <h3 className="stat-card-value">{card.value}</h3>
                            {card.suffix && <span className="stat-card-suffix">{card.suffix}</span>}
                        </div>
                        <p className="stat-card-title">{card.title}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
