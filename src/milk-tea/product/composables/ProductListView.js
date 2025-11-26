import { computed, watch } from 'vue' 
import { productState, loadProducts, categoryState, loadCategories } from '../composables/ProductsBase' 

export const listState = productState 

// Lấy danh sách categories từ state và biến thành computed
export const categories = computed(() => categoryState.list);
// Gọi hàm load categories khi module được import
loadCategories();


// Watcher cho Category (Không Debounce - Tải ngay)
watch(() => productState.category, (newVal, oldVal) => {

    if(newVal !== oldVal){
        productState.page = 0;
    }

    // Luôn clear timeout của keyword để đảm bảo category được ưu tiên
    clearTimeout(productState.searchTimeout); 
    loadProducts(); 
}, { immediate: true }); // immediate: true để tải danh sách lần đầu tiên


// Watcher cho Keyword (Có Debounce - Tải sau 100ms dừng gõ)
watch(() => productState.keyword, (newVal, oldVal) => {

    if(newVal !== oldVal){
        productState.page = 0;
    }

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

// ==== Hàm thay đổi trang ====
export async function changePage(newPage) {

    if (productState.isLoading) return;
    if (newPage < 0) return;
    if (productState.totalPages > 0 && newPage >= productState.totalPages) return;

    // 2. Cập nhật state page
    productState.page = newPage;

    // 3. Gọi lại hàm loadProducts để lấy dữ liệu của trang mới
    await loadProducts();
    
    // (Tuỳ chọn) Scroll lên đầu trang sau khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// Hàm tiện ích cho nút "Next"
export async function nextPage() {
    await changePage(productState.page + 1);
}

// Hàm tiện ích cho nút "Previous"
export async function prevPage() {
    await changePage(productState.page - 1);
}