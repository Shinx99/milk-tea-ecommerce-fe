// product/store/ProductListView.js

import { computed, watch } from 'vue' // <<< IMPORT watch
import { productState, loadProducts } from '../store/ProductsBase' 

export const listState = productState // alias

// ==== Danh sách categories (danh mục) - DÙNG TÊN CỐ ĐỊNH HOẶC TÊN PHỔ BIẾN ====
// Bạn nên lấy danh sách tên danh mục này từ Backend (nếu có API /api/categories)
// Tạm thời, ta dùng danh sách tên phổ biến mà bạn biết (ví dụ: 'Trà Sữa', 'Trà Trái Cây', v.v.)
export const categories = [
  'All', 
  'Fruit Tea', // Thay thế bằng tên danh mục thực tế của bạn
  'Cheese Foam',
  'Milk Tea',
  'Brown Sugar Series',
  'Classic Series'
  // Thêm các Category Name khác tại đây
];

// ==== Theo dõi sự thay đổi của category để gọi lại API ====
watch(() => productState.category, (newCategory) => {
    // Gọi lại hàm loadProducts mỗi khi người dùng chọn category mới
    loadProducts(newCategory); 
}, { immediate: true }); // Dùng immediate: true để load lần đầu khi component được mount

// ==== Danh sách sản phẩm sau khi lọc & sắp xếp (BỎ LỌC THEO CATEGORY) ====
export const filteredProducts = computed(() => { 
  let arr = [...listState.list] 

  // LƯU Ý: Lọc theo Category đã được chuyển sang Backend (hàm loadProducts),
  // nên ta chỉ cần lọc theo keyword và sắp xếp ở Front-end.

  // --- Lọc theo keyword ---
  if (listState.keyword) { 
    const kw = listState.keyword.toLowerCase() 
    arr = arr.filter(p => 
      p.name.toLowerCase().includes(kw) || 
      (p.description || '').toLowerCase().includes(kw) 
    )
  }


  return arr
})