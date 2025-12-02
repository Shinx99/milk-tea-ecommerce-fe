import apiClient from '@/shared/service/apiClient.js'; 

const API_BASE_URL = "categories"; 
const ADMIN_READ_URL = "admin/categories"; 

const getAuthToken = () => {
    return localStorage.getItem('token');
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};


// 1. GET ALL CATEGORIES (ADMIN)

export async function getCategoryApi(params = { page: 0, size:5 }) {
    const token = getAuthToken();
    if (!token) throw new Error("Vui lòng đăng nhập Admin.");
    
    const searchParams = new URLSearchParams();
    // Bổ sung keyword cho tìm kiếm
    if (params.keyword) {
        searchParams.append('keyword', params.keyword);
    }
    // Bổ sung phân trang
    searchParams.append('page', params.page || 0);
    searchParams.append('size', params.size ||6);

    const url = `${ADMIN_READ_URL}?${searchParams.toString()}`;

    try {
        const response = await apiClient.get(url, { headers: getAuthHeaders() });
        const json = response.data;

        if (json.success && json.data && Array.isArray(json.data.content)) {
            return {
                items: json.data.content,
                page: json.data.pageNumber,
                size: json.data.pageSize,
                totalElements: json.data.totalElements,
                totalPages: json.data.totalPages,
            };
        }
        throw new Error('Định dạng phản hồi API không hợp lệ.');
    } catch (error) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            throw new Error(`Lỗi Quyền Truy Cập (HTTP ${status}).`);
        }
        throw new Error(error.message || 'Không thể tải danh sách danh mục.');
    }
}

    //2. CREATE / UPDATE CATEGORY (ADMIN)

export async function saveCategoryApi(id, payload) {
   
    // Kiểm tra token xác thực
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE_URL}/${encodeURIComponent(id)}` : API_BASE_URL;

    const finalPayload = {
        ...payload,

    };

    try {
        const response = await apiClient({
            method: method,
            url: url,
            data: finalPayload, 
            headers: getAuthHeaders()
        });
        return response.data; 
    } catch (error) {
        const backendMessage = error.response?.data?.message || error.message; 
        const message = backendMessage || 'Lưu danh mục thất bại.';
        // Ghi log chi tiết payload và lỗi để debug
        console.error("Lỗi load", finalPayload); 
        throw new Error(message);
    }
}
/**
 * 3. DELETE CATEGORY (ADMIN)
 */
export async function deleteCategoryApi(id) {
    const token = getAuthToken();
    if (!token) throw new Error("Bạn không có quyền thực hiện thao tác này.");
    
    try {
        await apiClient.delete(
            `${API_BASE_URL}/${encodeURIComponent(id)}`,
            { headers: getAuthHeaders() }
        );
        return true; 
    } catch (error) {
        const backendMessage = error.response?.data?.message || error.message; 
        const message = backendMessage || 'Xóa danh mục thất bại.';
        throw new Error(message);
    }
}