import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import './GradeScoreChart.css';

const GradeScoreChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/stats');
                if (response.data.success && response.data.gradeScores) {
                    // dữ liệu để hiển thị biểu đồ
                    const formattedData = response.data.gradeScores.map(item => ({
                        name: item.grade.includes('Khối') ? item.grade : `Khối ${item.grade}`,
                        avgScore: item.avgScore
                    }));
                    
                    // Sắp xếp dữ liệu theo khối lớp
                    formattedData.sort((a, b) => {
                         const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
                         const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
                         return numA - numB;
                    });
                    
                    setData(formattedData);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching grade scores:", err);
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    // Hàm hiển thị tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="chart-custom-tooltip">
                    <p className="tooltip-label">{label}</p>
                    <p className="tooltip-score">
                        Điểm trung bình: <span>{payload[0].value.toFixed(2)}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grade-score-chart-container">
            <div className="chart-header">
                <h3 className="chart-title">Phân bố điểm số theo khối lớp</h3>
                <div className="chart-actions">
                    <select className="chart-filter">
                        <option value="all">Tất cả khối</option>
                    </select>
                </div>
            </div>
            
            <div className="chart-body">
                {loading ? (
                    <div className="chart-loading">Đang tải biểu đồ...</div>
                ) : data.length === 0 ? (
                    <div className="chart-empty">Chưa có dữ liệu bài làm</div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
                            barSize={40}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#6b7280', fontSize: 13 }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#6b7280', fontSize: 13 }}
                                domain={[0, 10]}
                                ticks={[0, 2, 4, 6, 8, 10]}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                            <Bar 
                                dataKey="avgScore" 
                                radius={[6, 6, 0, 0]}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.avgScore >= 8 ? '#34A853' : entry.avgScore >= 5 ? '#fbbd08' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
            
            <div className="chart-legend">
                <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#34A853' }}></span>
                    <span>Tốt (≥ 8)</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#fbbd08' }}></span>
                    <span>Khá (≥ 5)</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
                    <span>Cần cố gắng (&lt; 5)</span>
                </div>
            </div>
        </div>
    );
};

export default GradeScoreChart;
