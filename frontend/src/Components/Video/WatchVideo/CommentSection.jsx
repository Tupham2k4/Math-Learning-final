import React, { useState, useEffect, useContext, useCallback } from "react";
import "./WatchVideo.css";
import userAvatarDefault from "../../Assets/group.png";
import CommentItem from "./CommentItem";
import { UserContext } from "../../../Context/UserContext";
import { getComments, createComment } from "../../../services/commentService";

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("auth-token");

  // Fetch comments safely
  const fetchComments = useCallback(async () => {
    if (!videoId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Đang gọi API fetch comments cho videoId:`, videoId);
      const fetchedComments = await getComments(videoId);
      console.log(`Dữ liệu comments trả về từ API:`, fetchedComments);
      setComments(fetchedComments || []);
    } catch (err) {
      console.error("Lỗi khi tải bình luận:", err);
      // HIỂN THỊ TRỰC TIẾP LỖI RA UI ĐỂ DEBUG
      setError(`Lỗi: ${err.message}. Vui lòng kiểm tra Console (F12)`);
    } finally {
      setIsLoading(false);
    }
  }, [videoId]);

  // Handle side effect to fetch comments on mount or videoId change
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Handle submitting a new top-level comment
  const handleSubmit = async (e) => {
    if (e && e.key && e.key !== "Enter") return;
    if (!text.trim()) return;

    // Optimistic UI: Create a temporary comment to show immediately
    const tempId = `temp_${Date.now()}`;
    const tempComment = {
      _id: tempId,
      content: text,
      user: { 
        name: user?.name || "Người dùng", 
        avatar: user?.avatar || null 
      },
      videoId,
      parentComment: null,
      createdAt: new Date().toISOString(),
    };

    setComments((prevComments) => [tempComment, ...prevComments]);
    const currentText = text;
    setText("");

    try {
      const savedComment = await createComment(
        { content: currentText, videoId },
        token
      );
      
      // Update UI: Replace temporary comment with true saved comment
      if (savedComment) {
        setComments((prevComments) => 
          prevComments.map(c => c._id === tempId ? savedComment : c)
        );
      } else {
        await fetchComments(); // Fallback re-fetch if mapping fails
      }
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      // Revert optimistic UI on error
      setComments((prevComments) => prevComments.filter((c) => c._id !== tempId));
      alert("Không thể gửi bình luận. Vui lòng thử lại!");
    }
  };

  // Handle submitting a reply
  const handleReply = async (replyText, parentId) => {
    if (!replyText.trim()) return;
    try {
      // Optimistic UI isn't strictly necessary for replies but can be added similarly
      const savedReply = await createComment(
        { content: replyText, videoId, parentComment: parentId }, 
        token
      );
      
      if (savedReply) {
        // Option 1: push reply straight to state 
        setComments((prevComments) => [savedReply, ...prevComments]);
        // Option 2: fetch all (slower, but ensures perfect sync with server logic string/object id)
        // await fetchComments(); 
      }
    } catch (err) {
      console.error("Lỗi khi gửi phản hồi:", err);
      alert("Không thể gửi phản hồi. Vui lòng thử lại!");
    }
  };

  // Helper function: Group comments into a tree
  const renderCommentTree = () => {
    if (!Array.isArray(comments)) return null;

    const mainComments = comments.filter((c) => !c.parentComment);
    
    return mainComments.map((parent) => {
      const parentId = parent._id?.toString ? parent._id.toString() : parent._id;
      
      const replies = comments.filter((c) => {
        if (!c.parentComment) return false;
        const pid = c.parentComment?._id || c.parentComment;
        return pid?.toString ? pid.toString() === parentId : pid === parentId;
      });
      
      return (
        <div key={parent._id} className="comment-group">
          <CommentItem 
            comment={parent} 
            isLoggedIn={!!user} 
            onReply={handleReply} 
          />
          
          {replies.length > 0 && (
            <div className="replies-container">
              {replies.map((reply) => (
                <CommentItem 
                  key={reply._id} 
                  comment={reply} 
                  isLoggedIn={!!user} 
                  onReply={handleReply} 
                />
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="comment-section-card">
      <h2 className="comment-section-title">{comments.length} Bình luận</h2>

      {user ? (
        <div className="comment-input-row">
          <img
            src={user.avatar || userAvatarDefault}
            alt="Avatar người dùng"
            className="comment-avatar"
            onError={(e) => { e.target.src = userAvatarDefault; }}
          />
          <div className="comment-input-wrapper">
            <input
              type="text"
              className="comment-input"
              placeholder="Viết bình luận..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleSubmit}
              disabled={isLoading && comments.length === 0}
            />
            <button className="comment-send-icon" onClick={() => handleSubmit()}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="auth-prompt">
          <p>Vui lòng <a href="/dang-nhap">Đăng nhập</a> để bình luận.</p>
        </div>
      )}

      {error && <div className="error-message" style={{ color: "red", margin: "10px 0" }}>{error}</div>}
      
      {isLoading && comments.length === 0 ? (
        <div className="loading-message">Đang tải bình luận...</div>
      ) : (
        <div className="comment-list">
          {renderCommentTree()}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
