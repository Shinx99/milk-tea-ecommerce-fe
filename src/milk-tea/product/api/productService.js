import apiClient from '../api/apiClient';

// Tải danh sách sản phẩm với tham số lọc và tìm kiếm
export async function fetchProducts(params = {}) {
    const { category, keyword } = params;
    
    const searchParams = new URLSearchParams();
    let endpoint = '/products'; 

    // Logic: Quyết định endpoint dựa trên tham số
    if (category && category !== 'All') {
        // Lọc theo Category
        searchParams.append('name', category); 
        endpoint = '/products/by-category-name';

    } else if (keyword) {
        // Tìm kiếm theo Keyword
        searchParams.append('name', keyword); 
        endpoint = '/products/search';
    } 
    
    // Tạo chuỗi query string (ví dụ: ?name=...)
    const queryString = searchParams.toString();
    
    // Xây dựng URL cuối cùng
    const url = `${endpoint}${queryString ? '?' + queryString : ''}`;

    try {
        // Dùng apiClient (đã có baseURL) để gọi API
        const response = await apiClient.get(url);
        return response.data;

    } catch (error) {
        const status = error.response?.status;
        if (status === 404) {
            // Xử lý lỗi 404 cụ thể
            throw new Error(`Endpoint không tồn tại hoặc lỗi: HTTP ${status}`);
        }
        throw new Error('Không thể tải danh sách sản phẩm.');
    }
}

// Tải chi tiết sản phẩm theo ID
export async function fetchProductDetail(id) {
    const url = `/products/${id}`; // Ví dụ: /products/123
    
    try {
        const response = await apiClient.get(url);
        return response.data;
        
    } catch (error) {
        const status = error.response?.status;
        throw new Error(`Lỗi tải chi tiết: HTTP ${status || 'Unknown'}`);
    }
}

// Tải danh sách Categories
export async function fetchCategories() {
    try {
        const response = await apiClient.get('/categories'); 
        
        const rawData = response.data; 

        if (!Array.isArray(rawData)) {
            throw new Error("Dữ liệu categories nhận được không phải là mảng.");
        }

        // Logic chính: Dùng map để CHỈ LẤY categoryName từ mỗi đối tượng
        const categoryNames = rawData.map(item => item.categoryName);
        
        // Trả về mảng chuỗi (ví dụ: ['Fruit Tea', 'Milk Tea'])
        return categoryNames; 
        

    } catch (error) {
        console.error("Lỗi khi tải categories bằng Axios:", error.message || error);
        throw new Error("Không thể kết nối hoặc API bị lỗi."); 
    }
}