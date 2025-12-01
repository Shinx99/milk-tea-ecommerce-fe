import {reactive} from 'vue';
import { getCustomer, deleteCustomerApi, updateCustomerApi } from '../service/AdminCustomerService';
import { loadProducts } from '../../product/composables/ProductsBase';

// State dung cho cho Admin Customer
export const customerState = reactive({
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

export async function loadCustomer() {
  if (customerState.isLoading) return;

  customerState.isLoading = true;
  customerState.error = null;
  customerState.list = [];

  try {
    const params = {
      keyword: customerState.keyword,
      page: customerState.page,
      size: customerState.size
    };

    const result = await getCustomer(params);

  customerState.list = Array.isArray(result.items) ? result.items : [];
  customerState.page = result.page;
  customerState.size = result.size;
  customerState.totalPages = result.totalPages;
  customerState.totalElements = result.totalElements;

  } catch (error) {
    customerState.error = error.message || "Không thể tải dữ liệu khach hang!";
    customerState.list = [];
  } finally{
    customerState.isLoading = false;
  }
}

export async function updateCustomer(id, payload) {
  if(customerState.isLoading) return;

  customerState.isLoading = true;
  customerState.error = null;
  
  try {
    const updated = await updateCustomerApi(id, payload);
    console.log('Updated from API:', updated);
    const idx = customerState.list.findIndex(c => c.id === updated.id);
    if(idx !== -1){
      customerState.list[idx] = updated;
    } else{
      await loadCustomer();
    }

    return updated;
  } catch (error) {
    customerState.error = error.message || "Không thể cập nhật khách hàng!";
    throw error;
  } finally {
    customerState.isLoading = false;
  }
}

export async function deleteCustomer(id) {

  if(customerState.isLoading) return;

  customerState.isLoading = true;
  customerState.error = null;

  try {
    await deleteCustomerApi(id);

    customerState.list = customerState.list.filter(c => c.id !== id);
    customerState.totalElements -= 1;

    await loadCustomer();
  } catch (error) {
    customerState.error = error.message || "Không thể xóa khách hàng!";
    throw error;
  } finally{
    customerState.isLoading = false;
  }

}

// Ham thay doi trang
export async function changePage(newPage) {
  if (customerState.isLoading) return;
  if(newPage < 0) return;
  if(customerState.totalPages > 0 && newPage >= customerState.totalPages) return;

  customerState.page = newPage;

  await loadCustomer();

  window.scrollTo({top: 0, behavior: 'smooth'});
}

// Ham cho Next
export async function nextPage() {
  await changePage(customerState.page + 1);
}

// Ham cho Previous
export async function prevPage() {
  await changePage(customerState.page -1);
}