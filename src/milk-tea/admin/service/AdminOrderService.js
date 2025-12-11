import apiClient from '@/shared/service/apiClient.js';

//Ham fetch Order cho Admin
export async function fetchAdminOrder(params = {}) {
    const {
        keyword,
        page = 0,
        size = 0,
    } = params;

    const searchParams = new URLSearchParams();
    let endpoint = '/orders/admin';

    if(keyword && keyword.trim() !== ""){
        searchParams.append('keyword', keyword);
    };

    searchParams.set('page', page);
    searchParams.set('size', size);

    const url = `${endpoint}?${searchParams.toString()}`;

    try {
        const token = localStorage.getItem('token');

        if(!token){
            throw new Error('Bạn cần đăng nhập để xem danh sách hoa don');
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

        return{
            items: json.data.content,
            page: json.data.pageNumber,
            size: json.data.pageSize,
            totalElements: json.data.totalElements,
            totalPages: json.data.totalPages,
            first: json.data.first,
            last: json.data.last,
            message: json.message
        };
    } catch (error) {
        const status = error.response?.status;
        if(status === 404){
            throw new Error(`Endpoint không tồn tại hoặc lỗi: HTTP ${status}`);
        }
        throw new Error('Không thể tải danh sách hoa don.');
    }
}

