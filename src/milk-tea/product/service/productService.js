import apiClient from './apiClient';

// Tải danh sách sản phẩm với tham số lọc và tìm kiếm
export async function fetchProducts(params = {}) {
    const { category, 
        keyword,
        page = 0,
        size= 8,
        sortBy = 'createdAt',
        direction = 'DESC' } = params;
    
    const searchParams = new URLSearchParams();
    let endpoint = '/products/active'; 

    // Logic: Quyết định endpoint dựa trên tham số
    if (category && category !== 'All') {
        // Lọc theo Category
        searchParams.append('category', category); 

    } 
    
    if (keyword && keyword.trim() !== "") {
        // Tìm kiếm theo Keyword
        searchParams.append('keyword', keyword); 
    } 

    searchParams.set('page', page);
    searchParams.set('size', size);
    searchParams.set('sortBy', sortBy);
    searchParams.set('direction', direction);

    const url = `${endpoint}?${searchParams.toString()}`;

    try {
        const token = localStorage.getItem('token');

        const response = await apiClient.get(url);
        const json = response.data;

        if(!json.success || !json.data || !Array.isArray(json.data.content)){
            throw new Error('Response format khong match voi BE');
        }

        return {
            items: json.data.content,             // mảng ProductResponse
            page: json.data.pageNumber,
            size: json.data.pageSize,
            totalElements: json.data.totalElements,
            totalPages: json.data.totalPages,
            first: json.data.first,
            last: json.data.last,
            message: json.message,
    };

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
    const url = `/products/detail/${id}`; 
    
    try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get(url);
        return response.data.data;
        
    } catch (error) {
        const status = error.response?.status;
        throw new Error(`Lỗi tải chi tiết: HTTP ${status || 'Unknown'}`);
    }
}

// Tải danh sách Categories
export async function fetchCategories() {
    try {
        const response = await apiClient.get('/categories'); 

        const rawData = response.data.data; 

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

export async function fetchRelateProducts(id) {
    const url = `/products/relate/${id}`;

    try {
        const response = await apiClient.get(url);
        const json = response.data;

          if (!json.success || !json.data || !Array.isArray(json.data.content)) {
            throw new Error('Response format không đúng cho related products')
            }

        return json.data.content

    } catch (error) {
        const status = error.response?.status;
        throw new Error(`Lỗi tải chi tiết: HTTP ${status || 'Unknown'}`);
    }
}