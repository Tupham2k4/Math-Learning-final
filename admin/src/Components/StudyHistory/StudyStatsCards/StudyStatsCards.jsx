import React, { useEffect, useState } from "react";
import {
  FileText,
  CircleCheck,
  FileCheck,
  FileClock,
  GraduationCap,
  ChartNoAxesCombined,
} from "lucide-react";
import "./StudyStatsCards.css";
import { getStudyStats } from "../services/StudyHistoryService";

const StudyStatsCards = ({ stats = null }) => {
  const [apiStats, setApiStats] = useState({
    totalResults: 0,
    totalMcqResults: 0,
    totalEssayResults: 0,
    pendingResults: 0,
    gradedResults: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (stats) {
      setApiStats((prev) => ({ ...prev, ...stats }));
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await getStudyStats();
        setApiStats((prev) => ({ ...prev, ...(response?.data || {}) }));
      } catch (error) {
        console.error("Loi khi tai thong ke bai lam:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [stats]);

  const cards = [
    {
      title: "Tổng số bài làm",
      value: loading ? "..." : apiStats.totalResults,
      icon: <FileText size={28} />,
      colorClass: "study-card-blue",
    },
    {
      title: "Tổng số bài trắc nghiệm",
      value: loading ? "..." : apiStats.totalMcqResults,
      icon: <CircleCheck size={28} />,
      colorClass: "study-card-green",
    },
    {
      title: "Tổng số bài tự luận",
      value: loading ? "..." : apiStats.totalEssayResults,
      icon: <FileCheck size={28} />,
      colorClass: "study-card-purple",
    },
    {
      title: "Tổng số bài chưa chấm",
      value: loading ? "..." : apiStats.pendingResults,
      icon: <FileClock size={28} />,
      colorClass: "study-card-orange",
    },
    {
      title: "Tổng số bài đã chấm",
      value: loading ? "..." : apiStats.gradedResults,
      icon: <GraduationCap size={28} />,
      colorClass: "study-card-teal",
    },
    {
      title: "Điểm trung bình",
      value: loading ? "..." : Number(apiStats.averageScore || 0).toFixed(2),
      icon: <ChartNoAxesCombined size={28} />,
      colorClass: "study-card-red",
    },
  ];

  return (
    <div className="study-stats-container">
      {cards.map((item, index) => (
        <div key={index} className={`study-stat-card ${item.colorClass}`}>
          <div className="study-stat-icon-wrapper">{item.icon}</div>
          <div className="study-stat-info">
            <p className="study-stat-label">{item.title}</p>
            <h3 className="study-stat-number">{item.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyStatsCards;
