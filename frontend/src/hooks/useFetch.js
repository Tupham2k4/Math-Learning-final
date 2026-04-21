import { useState, useCallback } from "react";

const BASE_URL = "http://localhost:4000";

/**
 * Custom hook chuẩn để gọi API trong React
 * Hàm trả về state `loading`, `error`, và hàm `fetchData` thực hiện gọi mạng
 */
const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Gắn tự động BASE_URL nếu URL chưa đầy đủ
      const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
      
      // 2. Tự động merge config (mặc định lấy JSON)
      const config = {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers, // Merge header custom nếu có (vd Authorization)
        },
        ...options, // Body, credentials...
      };

      // Xóa Content-Type nếu dữ liệu gửi đi là FormData (File Uploads)
      // Cho phép fetch tự auto generate "multipart/form-data" + boundary ID
      if (options.body instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      // Tự động parse object thành string JSON nếu có truyền body (trừ khi là FormData dùng upload file)
      if (
        options.body && 
        typeof options.body === "object" && 
        !(options.body instanceof FormData)
      ) {
        config.body = JSON.stringify(options.body);
      }

      // 2. Fetch API
      const response = await fetch(url, config);

      // 3. Parse JSON (Bao gồm cả lỗi hay thành công đều trả message JSON)
      const data = await response.json();

      // 4. Xử lý response.ok
      if (!response.ok) {
        // Chủ động Throw sang Catch bên dưới
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      // Trả về dữ liệu nếu gọi API thành công
      return data;

    } catch (err) {
      // Lưu lại thông tin lỗi để UI hiển thị
      setError(err.message || "Không thể kết nối với máy chủ.");
      throw err; // Bắn ra ngoài để component cha có thể catch riêng nếu cần
    } finally {
      // Luôn kết thúc trạng thái tải bất kể fail hay success
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchData };
};

export default useFetch;
