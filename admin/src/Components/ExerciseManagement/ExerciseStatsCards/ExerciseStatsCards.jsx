import React, { useState, useEffect } from 'react';
import './ExerciseStatsCards.css';
import { BookOpen, BookOpenCheck, Pencil } from 'lucide-react';
import { getExerciseStats } from '../services/ExerciseService';
const ExerciseStatsCards = () => {
    const [stats, setStats] = useState({
        total: 0,
        mcq: 0,
        essay: 0
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchExerciseStats = async () => {
            try {
                const response = await getExerciseStats();
                const questions = response.data || [];
                const total = questions.length;
                const mcq = questions.filter(question => question.type === 'mcq').length;
                const essay = questions.filter(question => question.type === 'essay').length;
                setStats({ total, mcq, essay });
            } catch (error) {
                console.error("Lỗi khi tải thống kê bài tập", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExerciseStats();
    }, []);
    const statsData = [
        {
            title: "Tổng số bài tập",
            value: stats.total,
            icon: <BookOpen size={28} />,
            colorClass: "card-blue"
        },
        {
            title: "Trắc nghiệm",
            value: stats.mcq,
            icon: <BookOpenCheck size={28} />,
            colorClass: "card-green"
        },
        {
            title: "Tự luận",
            value: stats.essay,
            icon: <Pencil size={28} />,
            colorClass: "card-orange"
        }
    ];

    return (
        <div className='exercise-stats-container'>
            {statsData.map((item, index) => (
                <div key={index} className={`exercise-stat-card ${item.colorClass}`}>
                    <div className="exercise-stat-icon-wrapper">
                        {item.icon}
                    </div>
                    <div className="exercise-stat-info">
                        <p className="exercise-stat-label">{item.title}</p>
                        <h3 className="exercise-stat-number">
                            {loading ? "..." : item.value}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExerciseStatsCards;