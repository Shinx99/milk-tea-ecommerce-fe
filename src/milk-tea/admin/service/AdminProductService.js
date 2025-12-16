import apiClient from '@/shared/service/apiClient.js';

//Ham fetchProduct cho Admin
export async function fetchAdminProducts(params = {}) {
    const {
        category,
        keyword,
        page = 0,
        size = 8,
        sortBy = 'createdAt',
        direction = 'DESC' }  = params;

    const searchParams = new URLSearchParams();
    let endpoint = '/products/admin';

    if(category && category.trim() !== 'All'){
        searchParams.append('category', category);
    }

    if(keyword && keyword.trim() !== ""){
        searchParams.append('keyword', keyword);
    };

    searchParams.set('page', page);
    searchParams.set('size', size);
    searchParams.set('sortBy', sortBy);
    searchParams.set('direction', direction);

    const url = `${endpoint}?${searchParams.toString()}`;

    try{
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Bạn cần đăng nhập để xem danh sách sản phẩm');
        }


        const response = await apiClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const json = response.data;

        if(!json.success || !json.data || !Array.isArray(json.data.content)){
            throw new Error('Response format khong match voi BE');
        }

        return {
            items: json.data.content,
            page: json.data.pageNumber,
            size: json.data.pageSize,
            totalElements: json.data.totalElements,
            totalPages: json.data.totalPages,
            first: json.data.first,
            last: json.data.last,
            message: json.message
        };
    } catch(error){
        const status = error.response?.status;
        if(status === 404){
            throw new Error(`Endpoint không tồn tại hoặc lỗi: HTTP ${status}`);
        }
        throw new Error('Không thể tải danh sách sản phẩm.');
    }
}

//Ham fetch Categories
export async function fetchCategories() {
    try{
        const token = localStorage.getItem('token');

        const response = await apiClient.get('/categories/productAdmin', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const rawData = response.data.data;

        if(!Array.isArray(rawData)){
            throw new Error("Dữ liệu categories nhận được không phải là mảng.");
        }

        return rawData;
    } catch(error){
        console.error("Lỗi khi tải categories bằng Axios:", error.message || error);
        throw new Error("Không thể kết nối hoặc API bị lỗi."); 
    }
}


// Hàm create product
export async function createProducts(payload) {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Bạn cần đăng nhập quyền Admin để thực hiện thao tác này.');
        }

        const response = await apiClient.post('/products', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' // Bắt buộc vì Backend dùng @RequestBody
            }
        });

    } catch (error) {
        console.error("Lỗi khi tạo sản phẩm:", error);

        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || 'Lỗi không xác định từ server';
            
            if (status === 400) {
                throw new Error(`Dữ liệu không hợp lệ: ${message}`);
            }
            if (status === 401 || status === 403) {
                throw new Error('Bạn không có quyền thực hiện thao tác này.');
            }
        }

        throw new Error('Không thể tạo sản phẩm. Vui lòng thử lại sau.');
    }
}


// Hàm update product
export async function updateProduct(productId, payload) {
    try {
        if (!productId) {
            throw new Error('Thiếu Product ID để cập nhật.');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Bạn cần đăng nhập quyền Admin để thực hiện thao tác này.');
        }

        const response = await apiClient.put(`/products/${productId}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data; 

    } catch (error) {
        console.error(`Lỗi khi cập nhật sản phẩm ID ${productId}:`, error);

        // Xử lý các lỗi thường gặp
        if (error.response) {
            const status = error.response.status;
            const svMessage = error.response.data?.message; // Message lỗi từ Server nếu có

            if (status === 400) {
                throw new Error(`Dữ liệu cập nhật không hợp lệ: ${svMessage || 'Kiểm tra lại thông tin nhập vào'}`);
            }
            if (status === 404) {
                throw new Error('Sản phẩm này không còn tồn tại hoặc đã bị xóa.');
            }
            if (status === 401 || status === 403) {
                throw new Error('Phiên đăng nhập hết hạn hoặc không có quyền Admin.');
            }
        }
        
        throw new Error('Lỗi hệ thống. Không thể cập nhật sản phẩm.');
    }
}


export async function deleteProduct(productId) {
    try {
        // 1. Validate ID
        if (!productId) {
            throw new Error('Thiếu Product ID để xóa.');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Bạn cần đăng nhập quyền Admin để xóa sản phẩm.');
        }

        // 2. Gọi API DELETE
        // URL: /products/{id}
        const response = await apiClient.delete(`/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return true; 

    } catch (error) {
        console.error(`Lỗi khi xóa sản phẩm ID ${productId}:`, error);

        if (error.response) {
            const status = error.response.status;
            
            if (status === 404) {
                throw new Error('Sản phẩm không tồn tại hoặc đã bị xóa trước đó.');
            }
            if (status === 401 || status === 403) {
                throw new Error('Bạn không có quyền thực hiện thao tác này.');
            }
        }

        throw new Error('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
    }
}

