import React from 'react';
import AccountTableRow from '../AccountTableRow/AccountTableRow';
import EmptyState from '../EmptyState/EmptyState';
import './AccountTable.css';

const AccountTable = ({ users, currentPage = 1, limit = 10, onEdit, onDelete }) => {
    return (
        <div className="account-table-container">
            {users && users.length > 0 ? (
                <div className="account-table-wrapper">
                    <table className="account-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Họ và tên</th>
                                <th>Tên đăng nhập</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <AccountTableRow 
                                    key={user._id || index}
                                    user={user}
                                    index={index}
                                    currentPage={currentPage}
                                    limit={limit}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState />
            )}
        </div>
    );
};

export default AccountTable;
