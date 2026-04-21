import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import './AccountTableRow.css';

const AccountTableRow = ({ user, index, currentPage = 1, limit = 10, onEdit, onDelete }) => {
    // Tính STT thực tế
    const stt = (currentPage - 1) * limit + index + 1;

    // Giả lập username nếu db không có field này 
    const username = user.username || (user.email ? user.email.split('@')[0] : '-');

    return (
        <tr className="account-table-row">
            <td>{stt}</td>
            <td className="account-name-cell">
                <div className="account-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="account-name-text">{user.name || 'Người dùng ẩn danh'}</span>
            </td>
            <td>{username}</td>
            <td>{user.email || '-'}</td>
            <td>
                {user.role === 'admin' ? (
                    <span className="role-badge role-admin-badge">Quản trị viên</span>
                ) : (
                    <span className="role-badge role-user-badge">Học sinh</span>
                )}
            </td>
            <td>
                <div className="action-buttons text-center">
                    <button 
                        className="btn-action-edit" 
                        title="Sửa tài khoản"
                        onClick={() => onEdit && onEdit(user)}
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        className="btn-action-delete" 
                        title="Xóa tài khoản"
                        onClick={() => onDelete && onDelete(user._id)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default AccountTableRow;
