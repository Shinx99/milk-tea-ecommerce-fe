// product/api/productService.js

import apiClient from './apiClient'; // Dùng apiClient đã định nghĩa BASE_URL

// Tải danh sách sản phẩm với tham số lọc và tìm kiếm
export async function fetchProducts(params = {}) {
    const { category, keyword } = params;
    
    const searchParams = new URLSearchParams();
    let endpoint = '/products'; // URL mặc định

    if (category && category !== 'All') {
        searchParams.append('name', category); 
        endpoint = '/products/by-category-name';

    } else if (keyword) {
        searchParams.append('name', keyword); 
        endpoint = '/products/search';
    } 
    
    const queryString = searchParams.toString();
    
    // SỬA URL: Bỏ tiền tố '/api' vì nó đã có trong apiClient.baseURL
    const url = `${endpoint}${queryString ? '?' + queryString : ''}`;

    try {
        // Dùng apiClient.get() để gọi API
        const response = await apiClient.get(url);
        return response.data;

    } catch (error) {
        // Axios thường trả về status trong error.response
        const status = error.response?.status;
        if (status === 404) {
            throw new Error(`Endpoint không tồn tại hoặc lỗi: HTTP ${status}`);
        }
        throw new Error('Không thể tải danh sách sản phẩm.');
    }
}

// Tải chi tiết sản phẩm theo ID
export async function fetchProductDetail(id) {
    // SỬA URL: Bỏ tiền tố '/api'
    const url = `/products/${id}`;
    
    try {
        // Dùng apiClient.get() để gọi API
        const response = await apiClient.get(url);
        return response.data;
        
    } catch (error) {
        const status = error.response?.status;
        throw new Error(`Lỗi tải chi tiết: HTTP ${status || 'Unknown'}`);
    }
}