import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  NotebookPen, 
  BookOpen, 
  CircleHelp, 
  FileText, 
  BarChart3, 
  Video, 
  MessageCircle
} from 'lucide-react';
import './QuickAccessCards.css';

const QuickAccessCards = () => {
    const navigate = useNavigate();

    const accessItems = [
        { title: 'Quản lý học sinh', icon: <Users size={24} />, path: '/quan-ly-tai-khoan', color: 'blue' },
        { title: 'Quản lý bài giảng', icon: <NotebookPen size={24} />, path: '/quan-ly-bai-giang', color: 'green' },
        { title: 'Quản lý chương học', icon: <BookOpen size={24} />, path: '/quan-ly-chuong-bai', color: 'purple' },
        { title: 'Quản lý bài tập', icon: <CircleHelp size={24} />, path: '/quan-ly-bai-tap', color: 'orange' },
        { title: 'Quản lý kho đề', icon: <FileText size={24} />, path: '/quan-ly-kho-de', color: 'teal' },
        { title: 'Quản lý điểm', icon: <BarChart3 size={24} />, path: '/quan-ly-diem', color: 'red' },
        { title: 'Quản lý video', icon: <Video size={24} />, path: '/quan-ly-video', color: 'yellow' },
        { title: 'Lưu trữ bài làm', icon: <FileText size={24} />, path: '/luu-tru-bai-lam', color: 'pink' },
        { title: 'Quản lý Chatbot', icon: <MessageCircle size={24} />, path: '/quan-ly-chatbot', color: 'pink' }
    ];

    return (
        <div className="quick-access-container">
            <h3 className="quick-access-title">Truy cập nhanh</h3>
            <div className="quick-access-grid">
                {accessItems.map((item, index) => (
                    <div 
                        className={`quick-card quick-card-${item.color}`} 
                        key={index}
                        onClick={() => navigate(item.path)}
                    >
                        <div className="quick-card-icon">
                            {item.icon}
                        </div>
                        <h4 className="quick-card-text">{item.title}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickAccessCards;
