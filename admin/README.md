# Admin Dashboard - Math Learning

## 📖 Giới thiệu
Đây là hệ thống Trang quản trị phân quyền (Admin Portal) của dự án **Math Learning**. Frontend này phục vụ riêng biệt cho người dùng mang quyền giáo viên và người quản lý (Admin), mang để thiết lập nội dung nền tảng, điều hành các luồng dữ liệu cũng như theo dõi quá trình học tập của các học sinh.

## 🌳 Cấu trúc thư mục (Directory Tree)
```text
admin/
├── public/              # Tài nguyên ngoại tuyến công khai (Favicon, config, static files)
├── src/
│   ├── assets/          # Thư mục lưu trữ hình ảnh minh họa tĩnh và icons
│   ├── Components/      # Các module nhỏ cấu thành Giao diện quản trị (Navbar, Sidebar, Tables, Modals, Forms...)
│   ├── Pages/           # Các trang chuyên biệt (ChatbotManagement, AccountManagement, LessonManagement...)
│   ├── App.jsx          # Cấu hình Routing chung và Layer Layout (bố cục khung viền tổng thể)
│   ├── main.jsx         # Điểm khởi tạo gốc của React & Cấu hình Http Interceptors
│   └── index.css        # Khai báo Global CSS & Custom System Variables
├── package.json         # Danh sách các thư viện và cấu hình phiên bản Frontend
└── vite.config.js       # File cấu hình Server bundler / Development server của Vite
```

## ✨ Chức năng và Vai trò
- **Quản lý Sinh viên (Users)**: Theo dõi hoạt động, phân quyền và duyệt hồ sơ học viên tham gia.
- **Quản lý Bài giảng (Lessons) & Video**: Upload, cập nhật, phân chia nội dung theo Chương bài giảng chuẩn mực.
- **Hệ thống Bài tập & Kho đề (Exams)**: Setup các bài trắc nghiệm nhanh, tự luận dài cho kỳ thi kèm theo đáp án, thang điểm chi tiết.
- **Chấm điểm Tiểu luận/Tự luận**: Admin có thể vào kho lưu trữ (Study History) để chấm điểm và đánh giá trực tiếp cho từng câu làm bài tự luận của học viên.
- **Quản lý Chatbot AI**: 
  - Xem thống kê trực quan (Biểu đồ số liệu qua Recharts).
  - Tra soát toàn bộ lịch sử tư vấn AI của sinh viên với sự toàn vẹn Công thức (Toán/LaTeX rendering).
  - Xử lý các hội thoại kém chất lượng.
- **Báo cáo Thống kê Tổng quan (Dashboard)**: Cung cấp góc nhìn bao quát qua hệ thống biểu đồ và Thẻ thông tin nhanh (Quick Access Cards).

## 🛠 Công nghệ & Thư viện sử dụng
- **Core Library**: `React 19` (Vite Bundler vươn tới tốc độ Build và HMR siêu nhạy).
- **Styling**: Vanilla CSS linh hoạt cực kỳ rõ ràng cấu trúc kết hợp với Icon System sắc nét của `lucide-react`.
- **Fetching API**: `Axios` với cơ chế cấu hình Interceptor đẩy JWT auth-token động.
- **Routing**: `react-router-dom` (Nested Routing tiện lợi).
- **Chart/Visualizations**: `recharts` (Biểu đồ phân tích chuẩn xác).
- **Hiển thị Công thức Toán học**: `react-markdown`, `remark-math`, `rehype-katex` & `mathlive` (Render chuẩn LaTeX/Mathjax với style mượt mà).
