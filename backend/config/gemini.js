import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY không được định nghĩa trong biến môi trường");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const MODEL_STRATEGY = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-pro"
];

export const systemInstruction = `
- Bạn là một trợ lý ảo chuyên về Toán học.
- Luôn trả lời bằng tiếng Việt.
- Giải thích rõ ràng từng bước.
- Ưu tiên sử dụng định dạng markdown trong câu trả lời.
- Nếu có công thức toán học, luôn trả về định dạng LaTeX và đặt giữa hai dấu $$ (ví dụ: $$x^2 + y^2 = z^2$$).
- Không trả lời lan man, đi thẳng vào trọng tâm.
- Nếu câu hỏi không liên quan tới Toán học, hãy trả lời ngắn gọn và lịch sự.
`;

/**
 * Hàm hỗ trợ gọi Gemini API với cơ chế tự động fallback
 * @param {string|Array} prompt - Nội dung gửi cho AI
 * @param {Object} options - Các tùy chỉnh thêm (generationConfig)
 * @returns {Promise<Object>} - Kết quả từ AI (text, modelName, details)
 */
export const generateWithFallback = async (prompt, options = {}) => {
  let lastError = null;
  
  for (const modelName of MODEL_STRATEGY) {
    try {
      console.log(`[Gemini] Đang thử sử dụng model: ${modelName}...`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          ...options.generationConfig
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        return {
          text,
          modelName,
          usageMetadata: response.usageMetadata
        };
      }
    } catch (error) {
      const status = error.status || (error.message && error.message.includes("503") ? 503 : (error.message && error.message.includes("429") ? 429 : null));
      console.error(`[Gemini] Model ${modelName} thất bại (Status: ${status}):`, error.message);
      
      lastError = error;
      // Tiếp tục thử model tiếp theo trong danh sách
      continue;
    }
  }

  throw lastError || new Error("Tất cả các model Gemini trong chiến lược đều thất bại.");
};

// Export mặc định cho các code cũ vẫn hoạt động (dùng model ưu tiên nhất)
const defaultModel = genAI.getGenerativeModel({
  model: MODEL_STRATEGY[0],
});

export default defaultModel;
