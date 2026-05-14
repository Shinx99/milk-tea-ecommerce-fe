
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Gửi tin nhắn đến backend Spring Boot để chat với Gemini API.
 * Hàm này cần thiết để component ChatBox.vue có thể gọi được service.
 * @param {string} message Tin nhắn người dùng.
 * @returns {Promise<string>} Phản hồi dạng text từ AI.
 */
export async function chatWithGemini(message) {
  try {
    // Sử dụng instance apiClient để post request
    const response = await apiClient.post('/chat', {
      message: message
    });
    
    // Spring Boot ChatController trả về phản hồi thuần túy (String)
    return response.data; 
    
  } catch (error) {
    console.error("Lỗi gọi API chat:", error.response?.data || error.message);
    // Ném lỗi để component ChatBox có thể bắt và xử lý
    throw new Error(error.response?.data || 'Không thể kết nối đến máy chủ chat.');
  }
}

export default apiClient;