// src/milk-tea/account/service/Address.js

import { useUserStore } from "@/milk-tea/account/store";

const BASE_URL = "http://localhost:8080/api/addresses";

async function request(path, options = {}) {
  const userStore = useUserStore();
  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  if (userStore.token) {
    headers["Authorization"] = `Bearer ${userStore.token}`;
  }

  // JSON body
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    const message = payload.message || "Có lỗi xảy ra";
    const err = new Error(message);
    throw err;
  }

  return res.status === 204 ? null : res.json();
}

// ================= API =================

// Lấy tất cả địa chỉ theo user hiện tại
export function getMyAddresses() {
  return request(`/user`, { method: "GET" });
}

// Tạo địa chỉ mới
export function createAddress(payload) {
  return request("", {
    method: "POST",
    body: payload,
  });
}

// Cập nhật địa chỉ
export function updateAddress(id, payload) {
  return request(`/${id}`, {
    method: "PUT",
    body: payload,
  });
}

// Xoá mềm địa chỉ
export function deleteAddress(id) {
  return request(`/${id}`, {
    method: "DELETE",
  });
}

// =====================
// ADMIN ADDRESS API
// =====================
export function adminListByCustomer(customerId, params = {}) {
  return request.get(`/api/addresses/customer/${customerId}`, { params });
}

export function adminCreateAddress(customerId, data) {
  return request.post(`/api/addresses/customer/${customerId}`, data);
}

export function adminSetDefault(addressId) {
  return request.patch(`/api/addresses/${addressId}/set-default`);
}
