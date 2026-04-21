import React, { useState, useEffect } from "react";
import StudyHistoryHeader from "../Components/StudyHistory/StudyHistoryHeader/StudyHistoryHeader";
import StudyStatsCards from "../Components/StudyHistory/StudyStatsCards/StudyStatsCards";
import StudyFilterBar from "../Components/StudyHistory/StudyFilterBar/StudyFilterBar";
import SubmissionTable from "../Components/StudyHistory/SubmissionTable/SubmissionTable";
import SubmissionDetailModal from "../Components/StudyHistory/SubmissionDetailModal/SubmissionDetailModal";
import EssayGradingModal from "../Components/StudyHistory/EssayGradingModal/EssayGradingModal";
import DeleteSubmissionModal from "../Components/StudyHistory/DeleteSubmissionModal/DeleteSubmissionModal";
import { getAllSubmissions, getSubmissionDetail, deleteSubmission } from "../Components/StudyHistory/services/StudyHistoryService";

const StudyHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // States for View Modal
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // States for Grade Modal
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [gradeData, setGradeData] = useState(null);
  const [gradeLoading, setGradeLoading] = useState(false);

  // States for Delete Modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await getAllSubmissions();
      if (response.success) {
        setSubmissions(response.results);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logic filter
  const filteredSubmissions = submissions.filter((item) => {
    const name = item.user?.name || item.userName || "Khách";
    const matchName = name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchType = true;
    if (selectedType === "mcq") {
      matchType = item.type === "mcq";
    } else if (selectedType === "essay") {
      matchType = item.type === "essay";
    }

    let matchStatus = true;
    if (selectedStatus === "graded") {
      matchStatus = item.status === "graded";
    } else if (selectedStatus === "pending") {
      matchStatus = item.status === "pending";
    }

    return matchName && matchType && matchStatus;
  });

  const handleView = async (submission) => {
    setIsDetailOpen(true);
    setDetailLoading(true);
    try {
      const response = await getSubmissionDetail(submission._id);
      if (response.success) {
        setDetailData(response.result); 
      }
    } catch (err) {
      console.error("Lỗi khi tải chi tiết bài làm", err);
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleGrade = async (submission) => {
    setIsGradeOpen(true);
    setGradeLoading(true);
    try {
      const response = await getSubmissionDetail(submission._id);
      if (response.success) {
        setGradeData(response.result); 
      }
    } catch (err) {
      console.error("Lỗi khi tải chi tiết bài làm để chấm điểm", err);
      setGradeData(null);
    } finally {
      setGradeLoading(false);
    }
  };

  const handleDelete = (submission) => {
    setSubmissionToDelete(submission);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!submissionToDelete) return;
    setIsDeleting(true);
    try {
      await deleteSubmission(submissionToDelete._id);
      alert("Xóa bài làm thành công!");
      fetchSubmissions(); 
      setIsDeleteOpen(false);
      setSubmissionToDelete(null);
    } catch (err) {
      console.error("Lỗi khi xóa bài làm:", err);
      alert("Xóa bài làm thất bại!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <StudyHistoryHeader />
      <StudyStatsCards />
      
      <StudyFilterBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <div style={{ padding: "0 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>Đang tải dữ liệu...</div>
        ) : (
          <SubmissionTable 
            submissions={filteredSubmissions}
            onView={handleView}
            onGrade={handleGrade}
            onDelete={handleDelete}
          />
        )}
      </div>

      <SubmissionDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        data={detailData}
        loading={detailLoading}
      />

      <EssayGradingModal 
        isOpen={isGradeOpen}
        onClose={() => setIsGradeOpen(false)}
        data={gradeData}
        loading={gradeLoading}
        onSuccess={() => {
            fetchSubmissions(); 
        }}
      />

      <DeleteSubmissionModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        submission={submissionToDelete}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default StudyHistory;
