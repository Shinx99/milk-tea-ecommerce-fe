// product/api/apiClient.js

import axios from 'axios';

// Dựa trên @RequestMapping("/api/products") của bạn, root API là /api
const BASE_URL = 'http://localhost:8080/api'; // Hãy thay đổi cổng nếu Backend của bạn chạy ở cổng khác

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Thêm các headers khác như Authorization nếu cần
  },
});

export default apiClient;