// product/api/productService.js
// NỘI DUNG HOÀN CHỈNH

import apiClient from './apiClient'; 

/**
 * Lấy danh sách tất cả sản phẩm hoặc lọc theo tên danh mục
 * API: GET /api/products hoặc GET /api/products/by-category-name?name={categoryName}
 * @param {string} categoryName - Tên danh mục để lọc ('All' để lấy tất cả)
 * @returns {Promise<Array<Object>>}
 */
export const fetchProducts = async (categoryName = 'All') => {
  let url = '/products';
  
  if (categoryName && categoryName !== 'All') { // Kiểm tra cả null/undefined và 'All'
    // Sử dụng endpoint lọc theo tên
    url = `/products/by-category-name?name=${encodeURIComponent(categoryName)}`;
  }
  
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi tải danh sách sản phẩm (${categoryName}):`, error);
    throw new Error('Không thể tải danh sách sản phẩm từ API.');
  }
};

/**
 * Lấy chi tiết sản phẩm theo ID (UUID)
 * API: GET /api/products/{id}
 * @param {string} id - ID (UUID) của sản phẩm
 * @returns {Promise<Object>}
 */
export const fetchProductDetail = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi tải chi tiết sản phẩm ${id}:`, error);
    // Vẫn ném lỗi để logic ở View/Store xử lý 404
    throw new Error('Không tìm thấy sản phẩm hoặc lỗi kết nối.');
  }
};

/**
 * Lấy danh sách sản phẩm theo Category ID (UUID)
 * API: GET /api/products/by-category/{categoryId}
 * @param {string} categoryId - ID (UUID) của danh mục
 * @returns {Promise<Array<Object>>}
 */
export const fetchProductsByCategory = async (categoryId) => {
  try {
    const response = await apiClient.get(`/products/by-category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi tải sản phẩm theo danh mục ${categoryId}:`, error);
    throw new Error('Không thể tải sản phẩm theo danh mục.');
  }
};

// Bạn có thể thêm các hàm POST, PUT, DELETE khác ở đây...