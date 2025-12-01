import { useUserStore } from '@/milk-tea/account/store';
import apiClient from '@/shared/service/apiClient.js';

//Public API
// GET /api/customers
export async function getCustomer(params = {}){
    const {
      keyword,
      page = 0,
      size = 20,
      sortBy = 'createdAt',
      direction = 'DESC' } = params;

    const searchParams = new URLSearchParams();
    let endpoint = 'customers';

    if(keyword && keyword != ''){
      searchParams.append('keyword', keyword);
    }

    searchParams.set('page', page);
    searchParams.set('size', size);
    searchParams.set('sortBy', sortBy);
    searchParams.set('direction', direction);

    const url = `${endpoint}?${searchParams.toString()}`;

    try {
      const token = localStorage.getItem('token');

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
        messsage: json.messsage,
      }
    } catch (error) {
      const status = error.response?.status;
      if(status === 404){
        throw new Error(`Endpoint không tồn tại hoặc lỗi: HTTP ${status}`);
      }
      throw new Error('Không thể tải danh sách sản phẩm.');
    }
}

// GET /api/customers/active -> Hien thi customers (isActive = true)
// export function getActiveCustomers(options = {}){
//     return request('/active', { method: 'GET', ...options})
// }

// PUT /api/customers/{id} -> Update customer
export async function updateCustomerApi(id, payload){

    const token = localStorage.getItem('token');

    const response = await apiClient.put(
      `customers/admin/${encodeURIComponent(id)}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
}

// DELETE /api/customers/{id} (soft delete, 204) -> Delete customer
export async function deleteCustomerApi(id){
    const token = localStorage.getItem('token');

    const response = await apiClient.delete(
      `customers/${encodeURIComponent(id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data;
}

// Tùy chọn: hỗ trợ AbortController cho hủy request khi unmount [web:63]
export function createAbortController(){
    return new AbortController()
}