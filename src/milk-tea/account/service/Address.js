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

// ================= API CHO KHÁCH HÀNG THÔNG THƯỜNG =================

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
// ADMIN ADDRESS API (ĐÃ CHỈNH SỬA)
// =====================

/**
 * Lấy danh sách địa chỉ của khách hàng cụ thể (Admin)
 * @param {string} customerId ID của khách hàng
 */
export function adminListByCustomer(customerId) {
  // Đường dẫn đầy đủ: /api/addresses/customer/{customerId}
  return request(`/customer/${customerId}`, { method: "GET" });
}

/**
 * Tạo địa chỉ mới cho khách hàng cụ thể (Admin)
 * @param {string} customerId ID của khách hàng
 * @param {object} data Payload (UpdateAdminAddressRequest)
 */
export function adminCreateAddress(customerId, data) {
  // Đường dẫn đầy đủ: /api/addresses/customer/{customerId}
  return request(`/customer/${customerId}`, {
    method: "POST",
    body: data,
  });
}

/**
 * Đặt địa chỉ làm mặc định (Admin)
 * @param {string} addressId ID của địa chỉ
 */
export function adminSetDefault(addressId) {
  // Đường dẫn đầy đủ: /api/addresses/{addressId}/set-default
  return request(`/${addressId}/set-default`, {
    method: "PATCH",
  });
}
// Giả định hàm lấy danh sách Customer API (để AdminAddress.vue hoạt động)
// Vì BASE_URL là /api/addresses, ta phải dùng đường dẫn tuyệt đối cho customer service
// export function adminListCustomers() {
//   return request("http://localhost:8080/api/customers?page=0&size=100", {
//     method: "GET",
//   });
// }
