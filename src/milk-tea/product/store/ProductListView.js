import { computed, watch } from 'vue' 
import { productState, loadProducts, categoryState, loadCategories } from '../store/ProductsBase' 

export const listState = productState 

// Lấy danh sách categories từ state và biến thành computed
export const categories = computed(() => categoryState.list);
// Gọi hàm load categories khi module được import
loadCategories();


// Watcher cho Category (Không Debounce - Tải ngay)
watch(() => productState.category, () => {
    // Luôn clear timeout của keyword để đảm bảo category được ưu tiên
    clearTimeout(productState.searchTimeout); 
    loadProducts(); 
}, { immediate: true }); // immediate: true để tải danh sách lần đầu tiên


// Watcher cho Keyword (Có Debounce - Tải sau 100ms dừng gõ)
watch(() => productState.keyword, () => {
    clearTimeout(productState.searchTimeout); // Clear timeout cũ
    // Logic Debounce: thiết lập timeout mới
    productState.searchTimeout = setTimeout(() => {
        loadProducts(); // Gọi API sau 100ms dừng gõ
    }, 100);
});

// Danh sách sản phẩm hiển thị (ở đây chỉ trả về list gốc vì việc lọc do BE đảm nhiệm)
export const filteredProducts = computed(() => { 
    return [...listState.list] 
})