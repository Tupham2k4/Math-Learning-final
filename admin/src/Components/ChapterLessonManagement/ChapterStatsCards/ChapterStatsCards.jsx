import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, NotebookPen } from 'lucide-react';
import './ChapterStatsCards.css';

const ChapterStatsCards = () => {
    const [chapterCount, setChapterCount] = useState(0);
    const [lessonCount, setLessonCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Sử dụng Promise.all để gọi 2 API song song giúp tối ưu thời gian tải
                const [chaptersRes, lessonsRes] = await Promise.all([
                    axios.get('http://localhost:4000/api/chapters'),
                    axios.get('http://localhost:4000/api/lessons')
                ]);
                const chaptersData = chaptersRes.data.data || chaptersRes.data || [];
                const lessonsData = lessonsRes.data.data || lessonsRes.data || [];

                setChapterCount(chaptersData.length || 0);
                setLessonCount(lessonsData.length || 0);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu thống kê chương/bài:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="chapter-stats-container">
            <div className="chapter-stat-card chapter-card-purple">
                <div className="chapter-stat-icon-wrapper">
                    <BookOpen size={28} className="chapter-stat-icon" />
                </div>
                <div className="chapter-stat-content">
                    <p className="chapter-stat-title">Tổng số chương</p>
                    <h3 className="chapter-stat-value">
                        {loading ? '...' : chapterCount}
                    </h3>
                </div>
            </div>

            <div className="chapter-stat-card chapter-card-green">
                <div className="chapter-stat-icon-wrapper">
                    <NotebookPen size={28} className="chapter-stat-icon" />
                </div>
                <div className="chapter-stat-content">
                    <p className="chapter-stat-title">Tổng số bài giảng</p>
                    <h3 className="chapter-stat-value">
                        {loading ? '...' : lessonCount}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default ChapterStatsCards;
