import React, { useState, useEffect } from "react";
import axios from 'axios';
import LessonPageHeader from "../Components/LessonManagement/LessonPageHeader/LessonPageHeader";
import LessonFilterBar from "../Components/LessonManagement/LessonFilterBar/LessonFilterBar";
import LessonTable from "../Components/LessonManagement/LessonTable/LessonTable";
import Pagination from "../Components/AccountManagement/Pagination/Pagination";
import CreateLessonModal from "../Components/LessonManagement/CreateLessonModal/CreateLessonModal";
import EditLessonModal from "../Components/LessonManagement/EditLessonModal/EditLessonModal";
import LessonDetailModal from "../Components/LessonManagement/LessonDetailModal/LessonDetailModal";
import DeleteLessonModal from "../Components/LessonManagement/DeleteLessonModal/DeleteLessonModal";
import { createLesson, updateLesson, deleteLesson } from "../Components/LessonManagement/lessonService/lessonService";

const LessonManagement = () => {
    const [lessons, setLessons] = useState([]);
    const [chapters, setChapters] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    
    // States cho Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [refreshKey, setRefreshKey] = useState(0);

    // States cho Modals
    const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
    const [isEditLessonModalOpen, setIsEditLessonModalOpen] = useState(false);
    const [isDetailLessonModalOpen, setIsDetailLessonModalOpen] = useState(false);
    const [isDeleteLessonModalOpen, setIsDeleteLessonModalOpen] = useState(false);
    
    const [selectedLessonToEdit, setSelectedLessonToEdit] = useState(null);
    const [selectedLessonToView, setSelectedLessonToView] = useState(null);
    const [selectedLessonToDelete, setSelectedLessonToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [lessonRes, chapterRes] = await Promise.all([
                    axios.get('http://localhost:4000/api/lessons'),
                    axios.get('http://localhost:4000/api/chapters')
                ]);
                
                let rawLessons = lessonRes.data?.data || lessonRes.data || [];
                let chaptersData = chapterRes.data?.data || chapterRes.data || [];
                
                if (!Array.isArray(rawLessons)) rawLessons = [rawLessons].filter(Boolean);
                if (!Array.isArray(chaptersData)) chaptersData = [];

                setChapters(chaptersData); 

                const mappedLessons = rawLessons.map(lesson => {
                    const isPopulated = typeof lesson.chapterId === 'object' && lesson.chapterId !== null;
                    const cId = isPopulated ? lesson.chapterId._id : lesson.chapterId;
                    const foundChapter = chaptersData.find(c => String(c._id) === String(cId));
                    return {
                        ...lesson,
                        chapterName: (isPopulated ? lesson.chapterId.title : foundChapter?.title) || '-',
                        grade: (isPopulated ? lesson.chapterId.grade : foundChapter?.grade) || '-'
                    };
                });

                setLessons(mappedLessons);
            } catch (error) {
                console.error("Lỗi tải danh sách bài giảng hoặc chương:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refreshKey]);

    const handleAddLessonBtn = () => {
        setIsAddLessonModalOpen(true);
    };

    const handleCreateLessonSubmit = async (formData) => {
        try {
            await createLesson(formData);
            alert("Thêm bài giảng thành công!");
            setIsAddLessonModalOpen(false);
            setRefreshKey(prev => prev + 1); 
        } catch (error) {
            console.error("Lỗi thêm bài giảng:", error);
            alert(error.message || "Không thể thêm bài giảng.");
        }
    };

    const handleViewLesson = (lesson) => {
        setSelectedLessonToView(lesson);
        setIsDetailLessonModalOpen(true);
    };

    const handleEditLesson = (lesson) => {
        setSelectedLessonToEdit(lesson);
        setIsEditLessonModalOpen(true);
    };

    const handleEditLessonSubmit = async (lessonId, formData) => {
        try {
            await updateLesson(lessonId, formData);
            alert("Cập nhật bài giảng thành công!");
            setIsEditLessonModalOpen(false);
            setRefreshKey(prev => prev + 1); 
        } catch (error) {
            console.error("Lỗi cập nhật bài giảng:", error);
            alert(error.message || "Không thể cập nhật bài giảng.");
        }
    };

    const handleDeleteLesson = (lesson) => {
        setSelectedLessonToDelete(lesson);
        setIsDeleteLessonModalOpen(true);
    };

    const confirmDeleteLesson = async () => {
        if (!selectedLessonToDelete) return;
        try {
            await deleteLesson(selectedLessonToDelete._id);
            setIsDeleteLessonModalOpen(false);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Lỗi xóa bài giảng:", error);
            alert(error.message || "Xóa bài giảng thất bại!");
        }
    };

    // Filter Logic
    const filteredLessons = lessons.filter(lesson => {
        const matchSearch = searchTerm
            ? (lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
               lesson.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            : true;
            
        const lessonGradeNum = String(lesson.grade).replace(/\D/g, '');
        const selectedGradeNum = String(selectedGrade).replace(/\D/g, '');

        const matchGrade = selectedGrade 
            ? lessonGradeNum === selectedGradeNum
            : true;

        return matchSearch && matchGrade;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedGrade]);

    // Phân trang
    const totalPages = Math.ceil((filteredLessons?.length || 0) / limit) || 1;
    const startIndex = (currentPage - 1) * limit;
    const paginatedLessons = filteredLessons?.slice(startIndex, startIndex + limit) || [];

    return (
        <div className="Lesson-management-container">
            <LessonPageHeader />
            <LessonFilterBar 
                selectedGrade={selectedGrade}
                setSelectedGrade={setSelectedGrade}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAddLesson={handleAddLessonBtn}
            />

            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        Đang tải dữ liệu bài giảng...
                    </div>
                ) : (
                    <>
                        <LessonTable 
                            lessons={paginatedLessons}
                            currentPage={currentPage}
                            limit={limit}
                            onView={handleViewLesson}
                            onEdit={handleEditLesson}
                            onDelete={handleDeleteLesson}
                        />

                        <Pagination 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                            onPageChange={setCurrentPage} 
                        />
                    </>
                )}
            </div>

            <CreateLessonModal 
                isOpen={isAddLessonModalOpen}
                onClose={() => setIsAddLessonModalOpen(false)}
                onSubmit={handleCreateLessonSubmit}
                chapters={chapters} 
            />

            <EditLessonModal 
                isOpen={isEditLessonModalOpen}
                onClose={() => setIsEditLessonModalOpen(false)}
                selectedLesson={selectedLessonToEdit}
                onSubmit={handleEditLessonSubmit}
                chapters={chapters}
            />

            <LessonDetailModal
                isOpen={isDetailLessonModalOpen}
                onClose={() => setIsDetailLessonModalOpen(false)}
                lesson={selectedLessonToView}
            />

            <DeleteLessonModal
                isOpen={isDeleteLessonModalOpen}
                onClose={() => setIsDeleteLessonModalOpen(false)}
                onConfirm={confirmDeleteLesson}
                lesson={selectedLessonToDelete}
            />
        </div>
    );
};

export default LessonManagement;