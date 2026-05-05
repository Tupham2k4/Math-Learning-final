<h1 align="center">
  <br>
  📐 Math Learning
  <br>
</h1>

<h4 align="center">Nền tảng học toán trực tuyến tích hợp AI — Đồ án tốt nghiệp</h4>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-Storage-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
</p>

<p align="center">
  <a href="#-giới-thiệu">Giới thiệu</a> •
  <a href="#-tính-năng">Tính năng</a> •
  <a href="#-kiến-trúc-hệ-thống">Kiến trúc</a> •
  <a href="#-công-nghệ-sử-dụng">Công nghệ</a> •
  <a href="#-cài-đặt">Cài đặt</a> •
  <a href="#-cấu-trúc-dự-án">Cấu trúc</a> •
  <a href="#-api">API</a>
</p>

---

## 📖 Giới thiệu

**Math Learning** là một nền tảng học toán trực tuyến toàn diện được xây dựng như đồ án tốt nghiệp đại học. Hệ thống cung cấp môi trường học tập tương tác với bài giảng video, bài tập, kho đề thi, và trợ lý AI thông minh hỗ trợ giải toán theo thời gian thực.

> 🎓 Dự án hướng đến học sinh từ lớp 1 đến lớp 12, giúp tiếp cận kiến thức toán học một cách trực quan, sinh động và cá nhân hóa.

---

## ✨ Tính năng

### 👤 Người dùng (Frontend)
| Tính năng | Mô tả |
|-----------|--------|
| 🔐 Xác thực | Đăng ký, đăng nhập, đặt lại mật khẩu qua email |
| 📚 Bài giảng | Xem bài giảng theo chương trình lớp, chương, bài |
| 🎬 Video | Xem video bài giảng, bình luận, theo dõi tiến độ |
| 📝 Bài tập | Làm bài tập trắc nghiệm (MCQ) và tự luận (Essay) |
| 📋 Kho đề | Luyện tập với kho đề thi theo từng môn và lớp |
| 🤖 Chatbot AI | Hỏi đáp toán học với AI (Gemini), hỗ trợ render LaTeX |
| 📊 Kết quả | Xem lịch sử làm bài, điểm số, theo dõi tiến độ học tập |
| 🔑 Quên mật khẩu | Khôi phục tài khoản qua link gửi email |

### 🛠️ Quản trị viên (Admin Dashboard)
| Module | Chức năng |
|--------|-----------|
| 👥 Quản lý tài khoản | Xem, khóa/mở khóa tài khoản người dùng |
| 📖 Quản lý bài giảng | CRUD bài giảng, upload video, quản lý theo chương |
| 🗂️ Quản lý chương/bài | Thêm, sửa, xóa chương và bài học |
| 📝 Quản lý bài tập | Tạo đề bài tập MCQ & Essay, chỉnh sửa câu hỏi |
| 📋 Quản lý đề thi | Tạo đề thi thường và đề thi đặc biệt |
| 💬 Quản lý bình luận | Duyệt, xóa bình luận vi phạm |
| 🤖 Theo dõi Chatbot | Xem lịch sử hội thoại AI của người dùng |
| 📈 Thống kê | Dashboard tổng quan số liệu hệ thống |

---

## 🏗️ Kiến trúc hệ thống

```
Math Learning
├── frontend/          # React App (Người dùng)
├── admin/             # React App (Quản trị viên)  
└── backend/           # Node.js + Express REST API
```

```
┌─────────────┐    HTTP/REST    ┌──────────────────┐    ┌─────────────┐
│  Frontend   │ ◄────────────► │  Backend (API)   │ ──►│  MongoDB    │
│  (React)    │                │  (Express.js)    │    │  (Database) │
└─────────────┘                └──────────────────┘    └─────────────┘
                                        │
┌─────────────┐                         │──────────────► Gemini AI
│   Admin     │ ◄────────────────────── │──────────────► Cloudinary
│  (React)    │                         │──────────────► Nodemailer
└─────────────┘                         │──────────────► OpenAI (fallback)
```

---

## 🛠️ Công nghệ sử dụng

### Frontend & Admin
| Công nghệ | Mục đích |
|-----------|----------|
| **React 18** | Thư viện UI chính |
| **React Router DOM** | Điều hướng phía client |
| **Axios** | Gọi HTTP API |
| **KaTeX / MathJax** | Render công thức toán học |
| **CSS thuần** | Styling toàn bộ giao diện |

### Backend
| Công nghệ | Mục đích |
|-----------|----------|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose 9** | Cơ sở dữ liệu NoSQL |
| **JWT** | Xác thực người dùng |
| **bcryptjs** | Mã hóa mật khẩu |
| **Google Gemini AI** | Chatbot hỏi đáp toán học |
| **OpenAI** | Fallback cho AI chatbot |
| **Cloudinary** | Lưu trữ và phân phối media |
| **Multer** | Upload file |
| **Nodemailer** | Gửi email đặt lại mật khẩu |
| **Zod** | Validation dữ liệu |
| **express-rate-limit** | Giới hạn request, bảo mật |

---

## 🚀 Cài đặt

### Yêu cầu hệ thống
- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB** (local hoặc MongoDB Atlas)
- Tài khoản **Cloudinary**, **Google AI Studio**, **Gmail**

### 1. Clone dự án

```bash
git clone https://github.com/Tupham2k4/Math-Learning-final.git
cd Math-Learning-final
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend/`:

```env
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mathlearning
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Email (Nodemailer)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (cho link reset password)
FRONTEND_URL=http://localhost:3000
```

Chạy backend:

```bash
# Production
npm start

# Development (hot reload)
npm run server
```

> Backend mặc định chạy tại: `http://localhost:4000`

### 3. Cài đặt Frontend

```bash
cd frontend
npm install
npm start
```

> Frontend chạy tại: `http://localhost:3000`

### 4. Cài đặt Admin Dashboard

```bash
cd admin
npm install
npm run dev
```

> Admin chạy tại: `http://localhost:5173` 

---

## 📁 Cấu trúc dự án

```
Math-Learning/
│
├── backend/
│   ├── config/
│   │   ├── mongodb.js          # Kết nối MongoDB
│   │   └── cloudinary.js       # Kết nối Cloudinary
│   ├── controllers/
│   │   ├── authController.js   # Đăng ký, đăng nhập, reset password
│   │   ├── chatbotController.js# Xử lý hội thoại AI
│   │   ├── lessonController.js # CRUD bài giảng
│   │   ├── examController.js   # CRUD đề thi
│   │   ├── resultController.js # Chấm điểm, lưu kết quả
│   │   ├── statsController.js  # Thống kê hệ thống
│   │   └── ...
│   ├── models/
│   │   ├── User.js             # Schema người dùng
│   │   ├── Lesson.js           # Schema bài giảng
│   │   ├── Exam.js             # Schema đề thi
│   │   ├── Question.js         # Schema câu hỏi
│   │   ├── Result.js           # Schema kết quả
│   │   ├── Chapter.js          # Schema chương
│   │   ├── Comment.js          # Schema bình luận
│   │   ├── Conversation.js     # Schema hội thoại chatbot
│   │   └── ...
│   ├── routes/                 # Định nghĩa API routes
│   ├── middleware/             # Auth middleware, error handler
│   ├── utils/                  # Hàm tiện ích
│   └── server.js               # Entry point
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── Components/
│       │   ├── BaiGiang/       # Bài giảng (Grade, Chapter, Lesson)
│       │   ├── BaiTap/         # Bài tập (MCQ, Essay)
│       │   ├── KhoDe/          # Kho đề thi
│       │   ├── Video/          # Video bài giảng
│       │   ├── Chatbot/        # Giao diện AI Chatbot
│       │   ├── Quiz/           # Làm bài thi
│       │   ├── Password/       # Quên/reset mật khẩu
│       │   ├── Navbar/         # Thanh điều hướng
│       │   └── ...
│       ├── Context/            # React Context (UserContext)
│       ├── hooks/              # Custom hooks
│       ├── services/           # API service calls
│       ├── Pages/              # Các trang chính
│       └── index.js
│
└── admin/
    └── src/
        ├── Components/
        │   ├── AdminDashboard/         # Trang tổng quan
        │   ├── AccountManagement/      # Quản lý tài khoản
        │   ├── LessonManagement/       # Quản lý bài giảng
        │   ├── ChapterLessonManagement/# Quản lý chương/bài
        │   ├── ExerciseManagement/     # Quản lý bài tập
        │   ├── ExamManagement/         # Quản lý đề thi
        │   ├── VideoManagement/        # Quản lý video
        │   ├── CommentManagement/      # Quản lý bình luận
        │   ├── ChatbotManagement/      # Theo dõi chatbot
        │   └── StudyHistory/           # Lịch sử học tập
        └── ...
```

---

## 📡 API

Backend cung cấp REST API tại `http://localhost:4000`:

| Prefix | Chức năng |
|--------|-----------|
| `POST /api/auth/register` | Đăng ký tài khoản |
| `POST /api/auth/login` | Đăng nhập |
| `POST /api/auth/forgot-password` | Yêu cầu reset mật khẩu |
| `POST /api/auth/reset-password` | Đặt lại mật khẩu mới |
| `GET  /api/chapters` | Danh sách chương |
| `GET  /api/lessons` | Danh sách bài giảng |
| `GET  /api/questions` | Danh sách câu hỏi |
| `GET  /api/exams` | Danh sách đề thi |
| `POST /api/results` | Nộp bài và lưu kết quả |
| `POST /api/chatbot` | Gửi tin nhắn tới AI |
| `GET  /api/conversations` | Lịch sử hội thoại AI |
| `GET  /api/stats` | Thống kê tổng quan |
| `POST /api/upload` | Upload file media |

> 🔒 Các endpoint cần xác thực sẽ yêu cầu header: `Authorization: Bearer <token>`

---

## 🗄️ Mô hình dữ liệu

```
User ──────────── Result ─────────────── Exam
  │                                         │
  │                                     Question
  │
  └── Conversation ──── Message (chatbot history)

Chapter ──── Lesson ──── Comment
                  └───── Video
```

---

## 👨‍💻 Tác giả

| Thông tin | Chi tiết |
|-----------|----------|
| **Tên** | Tú Phạm |
| **GitHub** | [@Tupham2k4](https://github.com/Tupham2k4) |
| **Loại dự án** | Đồ án tốt nghiệp Đại học |
| **Năm thực hiện** | 2025 – 2026 |

---

## 📄 Giấy phép

Dự án này được phát triển phục vụ mục đích học thuật (đồ án tốt nghiệp). Mọi quyền được bảo lưu © 2026.

---

<p align="center">
  Made with ❤️ for Mathematics Education
</p>
