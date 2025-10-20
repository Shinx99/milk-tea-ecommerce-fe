// product/store/ProductListView.js

import { computed, watch } from 'vue' 
import { productState, loadProducts } from '../store/ProductsBase' 

export const listState = productState 

// ==== Danh sách categories ====
export const categories = [
    'All', 'Fruit Tea', 'Cheese Foam', 'Brown Sugar Series', 'Classic Series'
];

// ==== WATCHER: Theo dõi thay đổi Category và Keyword ====

// Watcher cho Category (Không Debounce)
watch(() => productState.category, () => {
    clearTimeout(productState.searchTimeout); 
    loadProducts(); // Gọi API ngay lập tức
}, { immediate: true }); 

// Watcher cho Keyword (Cần Debounce)
watch(() => productState.keyword, () => {
    clearTimeout(productState.searchTimeout);
    productState.searchTimeout = setTimeout(() => {
        loadProducts(); // Gọi API sau 300ms dừng gõ
    }, 100);
});

// ==== Danh sách sản phẩm sau khi lọc & sắp xếp (TỪ BE) ====
export const filteredProducts = computed(() => { 
    // Trả về danh sách thô vì lọc/tìm kiếm đã được xử lý ở Backend
    return [...listState.list] 
})