# Frontend - Math Learning Student Portal

## 📖 Giới thiệu
Đây là Cổng thông tin Học tập (Frontend Client) của dự án **Math Learning**, được thiết kế riêng biệt để đem lại trải nghiệm học tập môn Toán vượt trội dành cho sinh viên/học sinh. Giao diện được tối ưu hóa độ phản hồi xuất sắc, hỗ trợ người dùng từ khâu học lý thuyết cơ bản đến làm bài kiểm tra phức tạp và tương tác liên tục cùng mạng lưới AI tiên tiến.

## 🌳 Cấu trúc thư mục (Directory Tree)
```text
frontend/
├── public/              # Tài nguyên tĩnh tổng quát (index.html, manifest, robots, icons...)
├── src/
│   ├── Assets/          # Chứa ảnh minh họa, Vector graphics, fonts
│   ├── Components/
│   │   ├── BaiGiang/    # Lớp giao diện danh sách giảng dạy lý thuyết, PDF view
│   │   ├── BaiTap/      # Giao diện câu hỏi trắc nghiệm / tự luận
│   │   ├── Chatbot/     # Panel chat thông minh kết hợp Render Math (ChatInput, Header, MathRenderer, WelcomeScreen)
│   │   ├── KhoDe/       # Giao diện Tổng hợp đề thi
│   │   ├── Navbar/      # Thanh điều hướng trên cùng
│   │   ├── Progress/    # Bar đánh giá thành tích học tập tuần tự
│   │   ├── Video/       # Hệ thống nhúng player học thực tế
│   │   └── ...
│   ├── Pages/           # Các trang điều hướng (Router Views chính như Home, Account...)
│   ├── App.js           # Định nghĩa Base Layer và Tuyến đường (Routing)
│   └── index.css        # Khai báo Global Design System
└── package.json         # Khai báo Project Map và Frontend Dependencies
```

## ✨ Chức năng và Vai trò
- **Học Tập Đa Phương Tiện**: Hỗ trợ mở bài học Toán đa lớp thông qua tài liệu PDF nhúng trực tiếp hoặc qua Video hệ thống với độ ổn định cao.
- **Tiến Trình (Progress Tracking)**: Lưu lại điểm số, lịch sử luyện đề thi thử và hiển thị các gợi ý con đường cải thiện kết quả.
- **Luyện Tập Kho Đề Thực Tế**: Cung cấp giao diện phòng thi số hỗ trợ thao tác làm trắc nghiệm tốc độ cao (điền khuyết, chọn đáp án, nhập phân số tự luận).
- **Hệ thống Bình Luận Chéo**: Tham gia phản hồi đa chiều trực tiếp phía bên dưới mỗi video bài giảng để trao đổi kiến thức với giảng viên.
- **Chatbot Gia sư Toán Học (Gemini AI)**: Chế độ 1-1 Chatbot AI thông minh độc quyền, trực tiếp xử lý các phép toán phức tạp, giải phương trình và trình bày lại dưới định dạng ký hiệu Toán chuẩn xác (LaTeX) một cách siêu tốc và dễ hiểu.

## 🛠 Công nghệ & Thư viện sử dụng
- **Core Library**: `React` (Khởi tạo qua Create React App - Webpack).
- **Styling**: Vanilla CSS linh hoạt, sắc mượt thiết kế thân thiện người dùng qua bộ System Icon `lucide-react`.
- **Parsing/Rendering PDF**: `pdfjs-dist` & `react-pdf` (Đọc đề cương và sách nội suy trực tiếp).
- **Hiển thị và Vẽ Công thức Toán (Math Renderer)**: Cực kì công phu với sự kết hợp đỉnh cao của `react-markdown`, `remark-math`, `katex`, `react-katex` và `mathlive` (Bảo chứng cho các công thức Tích phân, Lim, Đạo hàm hay Ma trận hiển thị một cách sắc bén).
- **Giao Tiếp Networking**: `Axios` (Client-server requests).
- **Routing**: `react-router-dom` v7.
- **Testing**: Tích hợp DOM Testing thông qua `@testing-library`.
