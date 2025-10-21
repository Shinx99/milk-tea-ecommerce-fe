import { reactive } from "vue"; 
import { fetchProducts, fetchCategories } from '../api/ProductService'; 

// ==== State gốc dùng chung cho toàn bộ sản phẩm (Product List) ====
export const productState = reactive({
    list: [], 
    isLoading: false, 
    error: null, 
    // State dùng để gửi lên BE API
    keyword: "", 
    category: "All", 
    searchTimeout: null, // Dùng cho Debounce
});

// === STATE MỚI CHO CATEGORIES ===
export const categoryState = reactive({
    list: ['All'], // Khởi tạo với 'All'
    isLoading: false,
    error: null
});


// ==== Hàm load sản phẩm (Gọi API và quản lý state) ====
export async function loadProducts() { 
    if (productState.isLoading) return; 

    productState.isLoading = true;
    productState.error = null;
    productState.list = []; 

    try {
        const params = {
            category: productState.category,
            keyword: productState.keyword
        };

        const data = await fetchProducts(params); 
        // Đảm bảo data là mảng trước khi gán
        productState.list = Array.isArray(data) ? data : [];
        
    } catch (err) {
        productState.error = err.message || "Không thể tải dữ liệu sản phẩm.";
        productState.list = []; 
    } finally {
        productState.isLoading = false;
    }
}

// === HÀM LOAD CATEGORIES ===
export async function loadCategories() {
    if (categoryState.isLoading) return;

    categoryState.isLoading = true;
    categoryState.error = null;
    
    try {
        // data là mảng chuỗi (ví dụ: ['Fruit Tea', ...])
        const data = await fetchCategories(); 
        
        const categoriesFromApi = data; 
        // Logic chính: Thêm 'All' vào đầu danh sách categories
        categoryState.list = ['All', ...categoriesFromApi]; 

    } catch (err) {
        console.error("Lỗi khi tải categories:", err);
        categoryState.error = err.message || "Không thể tải danh mục sản phẩm."; 
        categoryState.list = ['All']; // Về trạng thái mặc định
    } finally {
        categoryState.isLoading = false;
    }
}


// ==== Hàm tìm sản phẩm theo ID trong cache (dùng cho Detail)
export function getProductById(id) { 
    // Tìm trong danh sách hiện tại (cache)
    return productState.list.find((p) => String(p.id) === String(id)) || null;
}