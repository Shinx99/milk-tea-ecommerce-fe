// product/store/ProductsBase.js
// Đảm bảo cả ba (state, loadProducts, getProductById) đều được EXPORT

import { reactive } from "vue"; 
// Sửa đường dẫn import của bạn thành: '../api/productService' hoặc đường dẫn Alias đúng
// TÔI GIẢ ĐỊNH BẠN ĐANG DÙNG ĐƯỜNG DẪN TƯƠNG ĐỐI SAU KHI SỬA LỖI TRƯỚC:
import { fetchProducts } from '../api/productService'; 

// ==== State gốc dùng chung cho toàn bộ sản phẩm ====
export const productState = reactive({ // <<< PHẢI CÓ 'export'
  list: [], 
  isLoading: false, 
  error: null, 
  
  // State dùng để lọc và sắp xếp
  keyword: "", 
  category: "All", 
  sort: "popular", 
});

// ==== Hàm load sản phẩm (Gọi API) ====
export async function loadProducts(categoryName = 'All') { // <<< PHẢI CÓ 'export'
  if (productState.isLoading) return; 

  productState.isLoading = true;
  productState.error = null;
  productState.list = []; 

  try {
    const data = await fetchProducts(categoryName); 
    productState.list = Array.isArray(data) ? data : [];
    
  } catch (err) {
    console.error("Lỗi load sản phẩm:", err); 
    productState.error = err.message || "Không thể tải dữ liệu sản phẩm.";
    productState.list = []; 
  } finally {
    productState.isLoading = false;
  }
}

// ==== Hàm tìm sản phẩm theo ID ====
export function getProductById(id) { // <<< PHẢI CÓ 'export'
  return productState.list.find((p) => String(p.id) === String(id)) || null;
}