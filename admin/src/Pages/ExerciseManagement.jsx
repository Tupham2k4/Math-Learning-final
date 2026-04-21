import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExerciseHeader from '../Components/ExerciseManagement/ExerciseHeader/ExerciseHeader';
import ExerciseStatsCards from '../Components/ExerciseManagement/ExerciseStatsCards/ExerciseStatsCards';
import ExerciseFilterBar from '../Components/ExerciseManagement/ExerciseFilterBar/ExerciseFilterBar';
import ExerciseTable from '../Components/ExerciseManagement/ExerciseTable/ExerciseTable';
import { getExerciseStats, deleteExercise, updateExercise, createExercise } from '../Components/ExerciseManagement/services/ExerciseService'; 
import Pagination from '../Components/AccountManagement/Pagination/Pagination';
import AddExerciseTypeModal from '../Components/ExerciseManagement/AddExerciseTypeModal/AddExerciseTypeModal';
import AddMcqExerciseForm from '../Components/ExerciseManagement/AddMcqExerciseForm/AddMcqExerciseForm';
import AddEssayExerciseForm from '../Components/ExerciseManagement/AddEssayExerciseForm/AddEssayExerciseForm';
import ExerciseDetailModal from '../Components/ExerciseManagement/ExerciseDetailModal/ExerciseDetailModal';
import DeleteExerciseModal from '../Components/ExerciseManagement/DeleteExerciseModal/DeleteExerciseModal';
import EditExerciseModal from '../Components/ExerciseManagement/EditExerciseModal/EditExerciseModal';

const ExerciseManagement = () => {
    const [exercises, setExercises] = useState([]);
    const [allChapters, setAllChapters] = useState([]);
    const [allLessons, setAllLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    
    // Thuộc tính Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');

    // State cho Modals
    const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false);
    const [isAddMcqModalOpen, setIsAddMcqModalOpen] = useState(false);
    const [isAddEssayModalOpen, setIsAddEssayModalOpen] = useState(false);
    
    // State cho View / Edit / Delete
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [exerciseToDelete, setExerciseToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [exerciseToEdit, setExerciseToEdit] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [exRes, chapRes, lessRes] = await Promise.all([
                    getExerciseStats().catch(err => ({ data: [] })),
                    axios.get('http://localhost:4000/api/chapters').catch(err => ({ data: { data: [] } })),
                    axios.get('http://localhost:4000/api/lessons').catch(err => ({ data: { data: [] } }))
                ]);
                
                setExercises(exRes.data || []);
                setAllChapters(chapRes.data?.data || chapRes.data || []);
                setAllLessons(lessRes.data?.data || lessRes.data || []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài tập", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredExercises = exercises.filter(exercise => {
        const titleMatch = exercise.lessonId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        
        const rawGrade = exercise.lessonId?.chapterId?.grade || '';
        const numGrade = String(rawGrade).replace(/\D/g, '');
        const gradeMatch = selectedGrade ? numGrade === String(selectedGrade) : true;

        return titleMatch && gradeMatch;
    });

    const totalPages = Math.ceil(filteredExercises.length / limit) || 1;
    const startIndex = (currentPage - 1) * limit;
    const paginatedExercises = filteredExercises.slice(startIndex, startIndex + limit);

    const handleSelectType = (type) => {
        setIsAddTypeModalOpen(false);
        if (type === 'mcq') {
            setIsAddMcqModalOpen(true);
        } else if (type === 'essay') {
            setIsAddEssayModalOpen(true);
        }
    };

    const handleAddExerciseSubmit = async (data) => {
        try {
            const result = await createExercise(data);
            alert("Thêm bài tập thành công!");
            
            const exRes = await getExerciseStats();
            setExercises(exRes.data || []);
            
        } catch (error) {
            console.error("Lỗi khi thêm bài tập:", error);
            alert("Thêm bài tập thất bại!");
        }
    };

    const handleMcqSubmit = (data) => {
        handleAddExerciseSubmit(data);
    };

    const handleEssaySubmit = (data) => {
        handleAddExerciseSubmit(data);
    };

    const handleView = (exercise) => {
        setSelectedExercise(exercise);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (exercise) => {
        setExerciseToEdit(exercise);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (id, data) => {
        try {
            await updateExercise(id, data);
            alert("Cập nhật bài tập thành công!");
            // Cập nhật lại state trực tiếp
            setExercises(exercises.map(ex => ex._id === id ? { ...ex, ...data } : ex));
            setIsEditModalOpen(false);
            setExerciseToEdit(null);
        } catch (error) {
            console.error("Lỗi khi cập nhật bài tập:", error);
            alert("Cập nhật bài tập thất bại!");
        }
    };

    const handleDelete = (exercise) => {
        setExerciseToDelete(exercise);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!exerciseToDelete) return;
        try {
            await deleteExercise(exerciseToDelete._id);
            setExercises(exercises.filter(ex => ex._id !== exerciseToDelete._id));
            setIsDeleteModalOpen(false);
            setExerciseToDelete(null);
        } catch (error) {
            console.error("Lỗi khi xóa bài tập:", error);
            alert("Xóa bài tập thất bại!");
        }
    };

    return (
        <div className="Exercise-management-container">
            <ExerciseHeader />
            <ExerciseStatsCards />
            <ExerciseFilterBar 
                searchItem={searchTerm}
                setSearchItem={setSearchTerm}
                selectedGrade={selectedGrade}
                setSelectedGrade={setSelectedGrade}
                onAddExercise={() => setIsAddTypeModalOpen(true)}
            />
            
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Đang tải dữ liệu...</div>
                ) : (
                    <>
                        <ExerciseTable 
                            exercises={paginatedExercises} 
                            currentPage={currentPage} 
                            limit={limit}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            <AddExerciseTypeModal 
                isOpen={isAddTypeModalOpen} 
                onClose={() => setIsAddTypeModalOpen(false)}
                onSelectType={handleSelectType}
            />

            <AddMcqExerciseForm 
                isOpen={isAddMcqModalOpen}
                onClose={() => setIsAddMcqModalOpen(false)}
                chapters={allChapters}
                lessons={allLessons}
                onSubmit={handleMcqSubmit}
            />

            <AddEssayExerciseForm 
                isOpen={isAddEssayModalOpen}
                onClose={() => setIsAddEssayModalOpen(false)}
                chapters={allChapters}
                lessons={allLessons}
                onSubmit={handleEssaySubmit}
            />

            <ExerciseDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                exercise={selectedExercise}
            />

            <DeleteExerciseModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                exercise={exerciseToDelete}
            />

            <EditExerciseModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                selectedExercise={exerciseToEdit}
                onSubmit={handleEditSubmit}
            />
        </div>
    );
};

export default ExerciseManagement;