import React, { useState } from "react";
import userAvatarDefault from "../../Assets/group.png";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const CommentItem = ({ comment, onReply, isLoggedIn }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(replyText, comment._id);
    setReplyText("");
    setShowReplyInput(false);
  };

  // Safe checks & Fallbacks
  const userName = comment?.user?.name || "Người dùng ẩn danh";
  
  // Tạo avatar từ tên bằng UI-Avatars nếu user không có ảnh
  // Nếu có lỗi parse URI (ví dụ tên có kí tự đặc biệt), encodeURIComponent sẽ đảm bảo an toàn
  const uiAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=5CB65F&color=fff&size=40&length=1&font-weight=bold`;
  const avatarSrc = comment?.user?.avatar || uiAvatarUrl;

  // Tính toán thời gian an toàn
  let timeAgo = "Vừa xong";
  try {
    if (comment?.createdAt) {
      timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
        addSuffix: true,
        locale: vi,
      });
    }
  } catch (error) {
    console.error("Lỗi parse ngày tháng:", error);
  }

  return (
    <div className={`comment-item-container ${comment?.parentComment ? "is-reply" : ""}`}>
      {/* Cấu trúc giống Facebook: Avatar bên trái, Nội dung bên phải */}
      <div className="comment-item" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        
        {/* AVATAR KHU VỰC TRÁI */}
        <img
          src={avatarSrc}
          alt={`Avatar của ${userName}`}
          className="comment-avatar"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0
          }}
          // Fallback cuối cùng nếu link ảnh (avatar/ui-avatars) bị chết
          onError={(e) => { 
            e.target.onerror = null; // Tránh loop nếu ảnh default cũng lỗi
            e.target.src = userAvatarDefault; 
          }}
        />

        {/* NỘI DUNG KHU VỰC PHẢI */}
        <div className="comment-content" style={{ flex: 1 }}>
          <div className="comment-bubble" style={{ 
              backgroundColor: '#f0f2f5', 
              padding: '8px 12px', 
              borderRadius: '16px',
              display: 'inline-block',
              maxWidth: '100%' 
          }}>
            <h4 className="comment-name" style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: '#050505' }}>
              {userName}
            </h4>
            <p className="comment-text" style={{ margin: 0, fontSize: '14px', color: '#050505', whiteSpace: 'pre-wrap' }}>
              {comment?.content}
            </p>
          </div>

          <div className="comment-actions" style={{ 
              display: 'flex', 
              gap: '12px', 
              alignItems: 'center', 
              marginTop: '4px',
              marginLeft: '12px',
              fontSize: '12px',
              fontWeight: '500'
          }}>
            <span className="comment-time" style={{ color: '#65676b' }}>
              {timeAgo}
            </span>
            
            {isLoggedIn && (
              <button 
                className="comment-reply-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#65676b',
                  cursor: 'pointer',
                  padding: 0,
                  fontWeight: 'bold',
                }}
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                Phản hồi
              </button>
            )}
          </div>

          {/* Ô INPUT TRẢ LỜI */}
          {showReplyInput && (
            <div className="reply-input-box" style={{ marginTop: '8px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
              <input
                type="text"
                className="comment-input reply-input"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '16px',
                  border: '1px solid #ccc',
                  outline: 'none',
                  fontSize: '14px'
                }}
                placeholder={`Trả lời ${userName}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                autoFocus
                onKeyPress={(e) => e.key === "Enter" && handleReplySubmit()}
              />
              <div className="reply-buttons" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                 <button 
                   className="reply-cancel" 
                   style={{ padding: '6px 12px', borderRadius: '16px', border: 'none', background: '#e4e6eb', cursor: 'pointer', fontWeight: 'bold' }} 
                   onClick={() => setShowReplyInput(false)}
                  >
                     Hủy
                  </button>
                 <button 
                   className="reply-submit" 
                   style={{ padding: '6px 12px', borderRadius: '16px', border: 'none', background: '#0866ff', color: 'white', cursor: 'pointer', fontWeight: 'bold' }} 
                   onClick={handleReplySubmit}
                 >
                    Gửi
                 </button>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default CommentItem;
