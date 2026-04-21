import React, { useState, useEffect } from 'react';
import { Users, UserCheck, ShieldCheck } from 'lucide-react';
import { getUserStats } from '../services/AccountService';
import './AccountStatsCards.css';

const AccountStatsCards = () => {
    const [stats, setStats] = useState({
        total: 0,
        students: 0,
        admins: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const response = await getUserStats();
                const users = response.data || [];
                
                const total = users.length;
                const students = users.filter(user => user.role === 'user').length;
                const admins = users.filter(user => user.role === 'admin').length;

                setStats({ total, students, admins });
            } catch (error) {
                console.error("Lỗi khi tải thống kê tài khoản:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStats();
    }, []);

    const statData = [
        {
            title: "Tổng số tài khoản",
            value: stats.total,
            icon: <Users size={28} />,
            colorClass: "card-blue"
        },
        {
            title: "Tài khoản học sinh",
            value: stats.students,
            icon: <UserCheck size={28} />,
            colorClass: "card-green"
        },
        {
            title: "Tài khoản admin",
            value: stats.admins,
            icon: <ShieldCheck size={28} />,
            colorClass: "card-orange"
        }
    ];

    return (
        <div className="account-stats-container">
            {statData.map((item, index) => (
                <div key={index} className={`account-stat-card ${item.colorClass}`}>
                    <div className="account-stat-icon-wrapper">
                        {item.icon}
                    </div>
                    <div className="account-stat-info">
                        <p className="account-stat-label">{item.title}</p>
                        <h3 className="account-stat-number">
                            {loading ? "..." : item.value}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AccountStatsCards;