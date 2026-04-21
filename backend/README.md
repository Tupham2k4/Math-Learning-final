# Backend - Math Learning Ecosystem

## 📖 Giới thiệu
Đây là hệ thống Backend cung cấp toàn bộ RESTful API cho dự án **Math Learning**. Hệ thống đóng vai trò xử lý trung tâm, quản lý cơ sở dữ liệu, xác thực người dùng, cung cấp nội dung học tập và kết nối với các dịch vụ AI bên ngoài để duy trì hoạt động cho toàn bộ nền tảng học Toán.

## 🌳 Cấu trúc thư mục (Directory Tree)
```text
backend/
├── config/              # Cấu hình hệ thống (Database, Gemini AI)
├── controllers/         # Nơi chứa logic xử lý chính của các tính năng
├── middleware/          # Middleware kiểm tra xác thực (auth, admin role, upload file)
├── models/              # Định nghĩa lược đồ cơ sở dữ liệu (Mongoose Schemas)
├── routes/              # Các Endpoint định tuyến API (API routes)
├── uploads/             # Nơi lưu trữ file đính kèm (Video, PDF, Hình ảnh)
├── .env                 # File biến môi trường (Thông tin nhạy cảm bảo mật)
├── server.js            # File khởi chạy chính của Server
└── package.json         # Danh sách các thư viện và cấu hình phiên bản
```

## ✨ Chức năng và Vai trò
- **Xác thực và Phân quyền**: Quản lý tài khoản (Đăng ký, Đăng nhập) qua JSON Web Token (JWT) và bảo mật quyền Admin.
- **RESTful API**: Cung cấp API chuẩn để thao tác Thêm, Đọc, Sửa, Xóa (CRUD) với các dữ liệu Bài giảng, Chương học, Câu hỏi trắc nghiệm/Tự luận, Video, ...
- **Chatbot AI Integration**: Quản lý kết nối với Google Gemini AI (hỗ trợ nhiều model và chế độ Fallback), cho phép tư vấn thông minh, phân tích công thức Toán học.
- **Lưu trữ Log & Kết quả**: Cho phép lưu log, lưu lịch sử học tập, câu trả lời và thông số đo lường hiệu suất của chatbot, qua đó hỗ trợ Admin Dashboard chấm điểm tự động, xuất báo cáo tổng quan.

## 🛠 Công nghệ & Thư viện sử dụng
- **Môi trường chạy**: `Node.js`
- **Web Framework**: `Express.js`
- **Database**: `MongoDB` & `Mongoose` (Object Data Modeling)
- **Bảo mật**: `bcryptjs` (Mã hóa mật khẩu), `jsonwebtoken` (Auth Tokens), CORS.
- **Kết nối AI**: `@google/generative-ai` (Gemini API của Google).
- **Tooling**: `nodemon` (Hot-reload cho quá trình phát triển).
