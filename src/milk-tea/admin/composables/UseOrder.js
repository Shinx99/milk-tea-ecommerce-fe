import {reactive} from 'vue';
import { fetchAdminOrder } from '../service/AdminOrderService';

// State dung cho cai Admin Order
export const orderState = reactive({
    list: [],
    isLoading: false,
    error: null,

    keyword: '',
    searchTimeout: null,

    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
});

export async function loadOrder() {
    if(orderState.isLoading) return;

    orderState.isLoading = true;
    orderState.error = null;
    orderState.list = [];

    try {
        const params = {
            keyword: orderState.keyword,
            page: orderState.page,
            size: orderState.size
        };

        const result = await fetchAdminOrder(params);

        orderState.list = Array.isArray(result.items) ? result.items : [];
        orderState.page = result.page;
        orderState.size = result.size;
        orderState.totalPages = result.totalPages;
        orderState.totalElements = result.totalElements;
    } catch (error) {

        orderState.error = error.message  || "Không thể tải dữ liệu khach hang!";
        orderState.list = [];
        
    } finally{
        orderState.isLoading = false;
    }
}

// Ham cho doi trang
export async function changePage(newPage) {
    if (orderState.isLoading) return;
    if(newPage < 0) return;
    if(orderState.totalPages > 0 && newPage >= orderState.totalPages);

    orderState.page = newPage;

    await loadOrder();

    window.scrollTo({top: 0, behavior: 'smooth'});
}

// Ham cho next
export async function nextPage() {
    await changePage(orderState.page + 1);
}

// Ham cho previous
export async function prevPage() {
    await changePage(orderState.page - 1);
}

