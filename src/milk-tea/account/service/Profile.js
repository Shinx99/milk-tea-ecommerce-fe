// Import store để lấy token xác thực
import { useUserStore } from '@/milk-tea/account/store';

// Đặt BASE_URL cho API quản lý người dùng/profile
// Thay đổi nếu endpoint của bạn khác
const BASE_URL = 'http://localhost:8080/api/customers';

/**
 * Hàm request dùng chung để chuẩn hóa việc gọi API.
 * Nó tự động thêm token, xử lý body và lỗi.
 * @param {string} path - Đường dẫn con của API (ví dụ: '/123-abc').
 * @param {object} options - Các tùy chọn cho fetch (method, body, headers, signal).
 * @returns {Promise<any>} - Dữ liệu trả về từ API.
 */
async function request(path, options = {}) {
  const userStore = useUserStore();
  const headers = {
    'Accept': 'application/json',
    ...options.headers,
  };

  // 1. Tự động thêm token vào header nếu người dùng đã đăng nhập
  if (userStore.token) {
    headers['Authorization'] = `Bearer ${userStore.token}`;
  }

  // 2. Tự động xử lý body và Content-Type cho các request không phải GET
  if (options.body && !(options.body instanceof FormData)) {
    // Nếu chưa có Content-Type, đặt là application/json
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    // Chuyển đổi object body thành chuỗi JSON
    options.body = JSON.stringify(options.body);
  }

  // 3. Thực hiện gọi API bằng fetch
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // 4. Xử lý lỗi một cách nhất quán
  if (!res.ok) {
    // Cố gắng đọc payload lỗi từ response
    const errorPayload = await res.json().catch(() => ({ 
      message: `Yêu cầu thất bại với mã trạng thái ${res.status}` 
    }));
    
    // Tạo và ném ra một lỗi có cấu trúc để composable có thể bắt
    const error = new Error(errorPayload.message || 'Có lỗi không xác định xảy ra');
    error.status = res.status;
    error.payload = errorPayload;
    throw error;
  }

  // 5. Xử lý response thành công
  // Nếu là 204 No Content (thường dùng cho DELETE), trả về null
  if (res.status === 204) {
    return null;
  }
  
  // Mặc định, parse response dưới dạng JSON
  return res.json();
}

// --- API Functions ---

/**
 * Lấy thông tin profile của người dùng theo ID.
 * Tương ứng với: GET /api/users/{id}
 * @param {string} id - ID của người dùng.
 * @returns {Promise<object>} - Thông tin profile của người dùng.
 */
export function getProfile(id) {
  if (!id) throw new Error("ID là bắt buộc để lấy thông tin profile.");
  return request(`/${id}`, { method: 'GET' });
}

/**
 * Cập nhật thông tin profile của người dùng theo ID.
 * Tương ứng với: PUT /api/users/{id}
 * @param {string} id - ID của người dùng.
 * @param {object} payload - Dữ liệu mới để cập nhật.
 * @returns {Promise<object>} - Thông tin profile đã được cập nhật.
 */
export function updateProfile(id, payload) {
  if (!id) throw new Error("ID là bắt buộc để cập nhật profile.");
  return request(`/${id}`, { method: 'PUT', body: payload });
}
