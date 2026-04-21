import React, { useState, useEffect } from 'react';
import AccountHeader from '../Components/AccountManagement/AccountHeader/AccountHeader';
import AccountStatsCards from '../Components/AccountManagement/AccountStatsCards/AccountStatsCards';
import AccountFilterBar from '../Components/AccountManagement/AccountFilterBar/AccountFilterBar';
import AccountTable from '../Components/AccountManagement/AccountTable/AccountTable';
import CreateAccountModal from '../Components/AccountManagement/CreateAccountModal/CreateAccountModal';
import EditAccountModal from '../Components/AccountManagement/EditAccountModal/EditAccountModal';
import DeleteConfirmModal from '../Components/AccountManagement/DeleteConfirmModal/DeleteConfirmModal';
import Pagination from '../Components/AccountManagement/Pagination/Pagination';
import { getUsers as fetchUsersApi, createUser, updateUser, deleteUser } from '../Components/AccountManagement/services/AccountService';

const AccountManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    
    const [refreshKey, setRefreshKey] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    
    // Modal states
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const response = await fetchUsersApi();
                const data = response.data || [];
                setUsers(data);
            } catch (error) {
                console.error("Lỗi tải danh sách người dùng:", error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, [refreshKey]);

    const handleAddUser = () => {
        setIsAddUserModalOpen(true);
    };

    const handleCreateAccountSubmit = async (formData) => {
        try {
            const response = await createUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            if (response.success) {
                setIsAddUserModalOpen(false);
                setRefreshKey(prev => prev + 1);
            } else {
                throw new Error(response.message || "Không thể tạo tài khoản");
            }
        } catch (error) {
            throw new Error(error.message || "Lỗi tạo tài khoản");
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsEditUserModalOpen(true);
    };

    const handleEditAccountSubmit = async (userId, payload) => {
        try {
            const response = await updateUser(userId, payload);
            if (response.success) {
                setIsEditUserModalOpen(false);
                setEditingUser(null);
                setRefreshKey(prev => prev + 1);
            } else {
                throw new Error(response.message || "Không thể cập nhật tài khoản");
            }
        } catch (error) {
            throw new Error(error.message || "Lỗi cập nhật");
        }
    };

    const handleDeleteUser = (userId) => {
        setDeletingUserId(userId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await deleteUser(deletingUserId);
            if(response.success) {
                setIsDeleteModalOpen(false);
                setDeletingUserId(null);
                setRefreshKey(prev => prev + 1);
            } else {
                throw new Error(response.message || "Xóa thất bại");
            }
        } catch (error) {
            throw new Error(error.message || "Lỗi xóa");
        }
    };

    const filteredUsers = users.filter(user => {
        const matchSearch = searchTerm
            ? (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
               user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
            : true;
            
        const matchRole = selectedRole 
            ? user.role === selectedRole
            : true;

        return matchSearch && matchRole;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedRole]);

    const totalPages = Math.ceil(filteredUsers.length / limit) || 1;
    const startIndex = (currentPage - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    return (
        <div className="account-management-page">
            <AccountHeader />
            <AccountStatsCards />
            <AccountFilterBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                onAddUser={handleAddUser}
            />
            
            <div className="account-table-and-pagination">
                <AccountTable 
                    users={paginatedUsers}
                    currentPage={currentPage}
                    limit={limit}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                />
                
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                />
            </div>

            <CreateAccountModal 
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onSubmit={handleCreateAccountSubmit}
            />

            <EditAccountModal 
                isOpen={isEditUserModalOpen}
                onClose={() => setIsEditUserModalOpen(false)}
                onSubmit={handleEditAccountSubmit}
                selectedUser={editingUser}
            />

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default AccountManagement;