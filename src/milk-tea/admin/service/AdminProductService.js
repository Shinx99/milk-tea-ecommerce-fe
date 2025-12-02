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

        // 1. Gọi API POST
        // Payload phải match với ProductRequest (name, categoryId, price, imageUrl...)
        const response = await apiClient.post('/products', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' // Bắt buộc vì Backend dùng @RequestBody
            }
        });

        // 2. Xử lý Response thành công
        // Backend trả về: 201 Created + Body JSON (ProductResponse)
        // apiClient thường đã tự parse JSON vào response.data
        return response.data; // Trả về ProductResponse để UI cập nhật list

    } catch (error) {
        console.error("Lỗi khi tạo sản phẩm:", error);

        // Xử lý lỗi chi tiết từ Backend (Validation error, Authorization...)
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || 'Lỗi không xác định từ server';
            
            if (status === 400) {
                // Lỗi Validation (vd: thiếu tên, giá âm...)
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
        // 1. Kiểm tra ID sản phẩm (Bắt buộc phải có để ghép vào URL)
        if (!productId) {
            throw new Error('Thiếu Product ID để cập nhật.');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Bạn cần đăng nhập quyền Admin để thực hiện thao tác này.');
        }

        // 2. Gọi API PUT
        // URL: /products/{id}
        // Payload: ProductRequest body
        const response = await apiClient.put(`/products/${productId}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // 3. Xử lý Response thành công
        // Backend trả về: 200 OK + Body JSON (ProductResponse đã update)
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


// Hàm delete product (Soft Delete theo logic backend)
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

        // 3. Xử lý Response
        // Backend trả về: 204 No Content (Thành công nhưng không có Body)
        // Không cần đọc response.data vì nó rỗng hoặc undefined
        
        // Nếu không ném lỗi ở dòng await delete, tức là thành công (Status 2xx)
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
            // Có thể xử lý thêm lỗi 409 Conflict nếu SP đang có trong đơn hàng (tùy logic BE)
        }

        throw new Error('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
    }
}

