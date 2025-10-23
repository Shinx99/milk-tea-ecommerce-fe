// src/milk-tea/account/service/Profile.js

import { useUserStore } from '@/milk-tea/account/store';

const BASE_URL = 'http://localhost:8080/api/customers';

async function request(path, options = {}) {
  const userStore = useUserStore();
  const headers = {
    'Accept': 'application/json',
    ...options.headers,
  };

  // Thêm token tự động nếu có
  if (userStore.token) {
    headers['Authorization'] = `Bearer ${userStore.token}`;
  }

  // Xử lý body dưới dạng JSON nếu không phải FormData và method không phải GET
  if (options.body && !(options.body instanceof FormData)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorPayload;
    try {
      errorPayload = await res.json();
    } catch {
      errorPayload = { message: `Yêu cầu thất bại với mã trạng thái ${res.status}` };
    }
    const error = new Error(errorPayload.message || 'Có lỗi không xác định xảy ra');
    error.status = res.status;
    error.payload = errorPayload;
    throw error;
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export function getProfile(id) {
  if (!id) throw new Error('ID là bắt buộc để lấy thông tin profile.');
  return request(`/${id}`, { method: 'GET' });
}

export function updateProfile(id, payload) {
  if (!id) throw new Error('ID là bắt buộc để cập nhật profile.');
  return request(`/${id}`, { method: 'PUT', body: payload });
}
