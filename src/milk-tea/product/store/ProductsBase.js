// product/store/ProductsBase.js

import { reactive } from "vue"; 
import { fetchProducts } from '../api/productService'; 

// ==== State gốc dùng chung cho toàn bộ sản phẩm ====
export const productState = reactive({
    list: [], 
    isLoading: false, 
    error: null, 
    
    // State dùng cho BE API
    keyword: "", 
    category: "All", 
    searchTimeout: null, // Đã thêm cho Debounce
});

// ==== Hàm load sản phẩm (Gọi API) ====
export async function loadProducts() { 
    if (productState.isLoading) return; 

    productState.isLoading = true;
    productState.error = null;
    productState.list = []; // Reset list để hiển thị loading

    try {
        const params = {
            category: productState.category,
            keyword: productState.keyword
        };

        // Gọi hàm API đã sửa
        const data = await fetchProducts(params); 
        productState.list = Array.isArray(data) ? data : [];
        
    } catch (err) {
        productState.error = err.message || "Không thể tải dữ liệu sản phẩm.";
        productState.list = []; 
    } finally {
        productState.isLoading = false;
    }
}

// ==== Hàm tìm sản phẩm theo ID ====
export function getProductById(id) { 
    return productState.list.find((p) => String(p.id) === String(id)) || null;
}