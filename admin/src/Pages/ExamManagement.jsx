import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExamPageHeader from '../Components/ExamManagement/ExamPageHeader/ExamPageHeader';
import GradeFilterBar from '../Components/ExamManagement/GradeFilterBar/GradeFilterBar';
import CategoryFilterBar from '../Components/ExamManagement/CategoryFilterBar/CategoryFilterBar';
import NormalExamTable from '../Components/ExamManagement/NormalExamTable/NormalExamTable';
import SpecialExamTable from '../Components/ExamManagement/SpecialExamTable/SpecialExamTable';
import AddNormalExamModal from '../Components/ExamManagement/AddNormalExamModal/AddNormalExamModal';
import AddSpecialExamModal from '../Components/ExamManagement/AddSpecialExamModal/AddSpecialExamModal';
import DeleteExamModal from '../Components/ExamManagement/DeleteExamModal/DeleteExamModal';
import ExamDetailModal from '../Components/ExamManagement/ExamDetailModal/ExamDetailModal';
import EditExamModal from '../Components/ExamManagement/EditExamModal/EditExamModal';

const ExamManagement = () => {
    // Tab Navigation
    const [activeTab, setActiveTab] = useState('chapter'); // 'chapter' hoặc 'special'

    // State cho bảng đề theo chương (Normal Exam)
    const [normalExams, setNormalExams] = useState([]);
    const [loadingNormal, setLoadingNormal] = useState(true);
    const [currentNormalPage, setCurrentNormalPage] = useState(1);
    const [isAddNormalModalOpen, setIsAddNormalModalOpen] = useState(false);
    
    // State cho bảng đề đặc biệt (Special Exam)
    const [specialExams, setSpecialExams] = useState([]);
    const [loadingSpecial, setLoadingSpecial] = useState(true);
    const [currentSpecialPage, setCurrentSpecialPage] = useState(1);
    const [isAddSpecialModalOpen, setIsAddSpecialModalOpen] = useState(false);

    // Xóa Exam State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [examToDelete, setExamToDelete] = useState(null);

    // Xem Exam State
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [examToView, setExamToView] = useState(null);

    // Chỉnh sửa Exam State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [examToEdit, setExamToEdit] = useState(null);

    const limit = 10;

    // Filters cho Đề theo chương
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');

    // Filters cho Đề đặc biệt
    const [selectedRole, setSelectedRole] = useState(''); // role chính là category

    useEffect(() => {
        const fetchExams = async () => {
            try {
                if (activeTab === 'chapter') {
                    setLoadingNormal(true);
                    const response = await axios.get('http://localhost:4000/api/exams/chapter').catch(() => ({ data: { data: [] } }));
                    setNormalExams(response.data?.data || response.data || []);
                    setLoadingNormal(false);
                } else {
                    setLoadingSpecial(true);
                    const response = await axios.get('http://localhost:4000/api/exams/special').catch(() => ({ data: { data: [] } }));
                    setSpecialExams(response.data?.data || response.data || []);
                    setLoadingSpecial(false);
                }
            } catch (error) {
                console.error("Lỗi tải đề thi:", error);
                setLoadingNormal(false);
                setLoadingSpecial(false);
            }
        };

        fetchExams();
    }, [activeTab]);

    // Lọc Đề theo chương
    const filteredNormalExams = normalExams.filter(exam => {
        const matchTitle = exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        
        const rawGrade = exam.grade || exam.chapterId?.grade || '';
        const numGrade = String(rawGrade).replace(/\D/g, '');
        const matchGrade = selectedGrade ? numGrade === String(selectedGrade) : true;

        return matchTitle && matchGrade;
    });

    // Lọc Đề đặc biệt
    const filteredSpecialExams = specialExams.filter(exam => {
        return selectedRole ? exam.category === selectedRole : true;
    });

    const paginatedNormalExams = filteredNormalExams.slice((currentNormalPage - 1) * limit, currentNormalPage * limit);
    const paginatedSpecialExams = filteredSpecialExams.slice((currentSpecialPage - 1) * limit, currentSpecialPage * limit);

    // Handlers
    const handleView = (exam) => {
        setExamToView(exam);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (exam) => {
        setExamToEdit(exam);
        setIsEditModalOpen(true);
    };

    const handleEditSuccess = () => {
        // Tải lại đúng tab
        const url = activeTab === 'chapter'
            ? 'http://localhost:4000/api/exams/chapter'
            : 'http://localhost:4000/api/exams/special';
        axios.get(url)
            .then(res => {
                const data = res.data?.data || res.data || [];
                activeTab === 'chapter' ? setNormalExams(data) : setSpecialExams(data);
            })
            .catch(console.error);
    };

    const handleDelete = (examId) => {
        setExamToDelete(examId);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!examToDelete) return;
        try {
            await axios.delete(`http://localhost:4000/api/exams/${examToDelete}`);
            setIsDeleteModalOpen(false);
            setExamToDelete(null);
            
            // Tải lại dữ liệu
            if (activeTab === 'chapter') {
                const response = await axios.get('http://localhost:4000/api/exams/chapter').catch(() => ({ data: { data: [] } }));
                setNormalExams(response.data?.data || response.data || []);
            } else {
                const response = await axios.get('http://localhost:4000/api/exams/special').catch(() => ({ data: { data: [] } }));
                setSpecialExams(response.data?.data || response.data || []);
            }
        } catch (error) {
            console.error("Lỗi xóa đề:", error);
            alert("Có lỗi xảy ra khi xóa đề.");
        }
    };

    const handleAddNormalSuccess = () => {
        setIsAddNormalModalOpen(false);
        // Tải lại dữ liệu
        axios.get('http://localhost:4000/api/exams/chapter')
            .then(res => setNormalExams(res.data?.data || res.data || []))
            .catch(console.error);
    };

    const handleAddSpecialSuccess = () => {
        setIsAddSpecialModalOpen(false);
        // Tải lại dữ liệu
        axios.get('http://localhost:4000/api/exams/special')
            .then(res => setSpecialExams(res.data?.data || res.data || []))
            .catch(console.error);
    };

    return (
        <div className="exam-management-container">
            <ExamPageHeader />

            {/* Tab Navigation Menu */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', padding: '0 4px' }}>
                <button 
                    onClick={() => setActiveTab('chapter')}
                    style={{
                        padding: '12px 24px', borderRadius: '12px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s',
                        border: activeTab === 'chapter' ? 'none' : '1px solid #e2e8f0',
                        backgroundColor: activeTab === 'chapter' ? '#3b82f6' : '#ffffff',
                        color: activeTab === 'chapter' ? 'white' : '#475569',
                        boxShadow: activeTab === 'chapter' ? '0 4px 6px -1px rgba(59, 130, 246, 0.4)' : 'none'
                    }}
                >
                    Đề thi theo chương
                </button>
                <button 
                    onClick={() => setActiveTab('special')}
                    style={{
                        padding: '12px 24px', borderRadius: '12px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s',
                        border: activeTab === 'special' ? 'none' : '1px solid #e2e8f0',
                        backgroundColor: activeTab === 'special' ? '#f59e0b' : '#ffffff',
                        color: activeTab === 'special' ? 'white' : '#475569',
                        boxShadow: activeTab === 'special' ? '0 4px 6px -1px rgba(245, 158, 11, 0.4)' : 'none'
                    }}
                >
                    Đề tài liệu đặc biệt
                </button>
            </div>
            
            {activeTab === 'chapter' ? (
                <>
                    <GradeFilterBar 
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedGrade={selectedGrade}
                        setSelectedGrade={setSelectedGrade}
                        onAddgrade={() => setIsAddNormalModalOpen(true)}
                    />

                    <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)', marginTop: '24px' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#111827', fontWeight: 'bold' }}>
                            Danh sách Đề theo chương
                        </h3>
                        {loadingNormal ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Đang tải danh sách đề...</div>
                        ) : (
                            <NormalExamTable 
                                exams={paginatedNormalExams}
                                currentPage={currentNormalPage}
                                limit={limit}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, paddingRight: '20px' }}>
                            <CategoryFilterBar 
                                selectedRole={selectedRole}
                                setSelectedRole={setSelectedRole}
                            />
                        </div>
                        <button 
                            className="grade-add-btn" 
                            onClick={() => setIsAddSpecialModalOpen(true)}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f59e0b', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer' 
                            }}
                        >
                            Thêm đề đặc biệt
                        </button>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)', marginTop: '24px' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#111827', fontWeight: 'bold' }}>
                            Danh sách Đề & Tài liệu đặc biệt
                        </h3>
                        {loadingSpecial ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Đang tải danh sách tài liệu...</div>
                        ) : (
                            <SpecialExamTable 
                                exams={paginatedSpecialExams}
                                currentPage={currentSpecialPage}
                                limit={limit}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                </>
            )}

            {/* Pagination Component cho Exam sẽ được chèn ở cuối nếu cần */}
            <AddNormalExamModal 
                isOpen={isAddNormalModalOpen}
                onClose={() => setIsAddNormalModalOpen(false)}
                onSuccess={handleAddNormalSuccess}
            />
            <AddSpecialExamModal 
                isOpen={isAddSpecialModalOpen}
                onClose={() => setIsAddSpecialModalOpen(false)}
                onSuccess={handleAddSpecialSuccess}
            />
            <DeleteExamModal 
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setExamToDelete(null);
                }}
                onConfirm={confirmDelete}
            />
            <ExamDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setExamToView(null);
                }}
                exam={examToView}
            />
            <EditExamModal 
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setExamToEdit(null);
                }}
                selectedLesson={examToEdit}
                onSubmit={handleEditSuccess}
            />
        </div>
    );
};

export default ExamManagement;