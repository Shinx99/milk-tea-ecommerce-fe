// product/store/ProductDetailView.js

import { ref, computed } from 'vue' 
import { fetchProductDetail } from '../api/productService' 
import { getProductById } from './ProductsBase.js' 

// Hàm composable dùng trong trang chi tiết sản phẩm
export function useProductDetail(productId) {
    const product = ref(getProductById(productId)) 
    const detailLoading = ref(false)
    const detailError = ref(null)

    // ĐÃ SỬA: Hàm tải chi tiết sản phẩm, chấp nhận ID mới
    async function loadDetail(idToLoad) {
        const currentId = idToLoad || productId;
        
        // Kiểm tra cache
        if (product.value && String(product.value.id) === String(currentId)) return; 
        
        product.value = null; // Reset product để hiển thị loading state
        detailLoading.value = true;
        detailError.value = null;

        try {
            const data = await fetchProductDetail(currentId); 
            product.value = data;
        } catch (err) {
            detailError.value = err.message || 'Không thể tải chi tiết sản phẩm.';
        } finally {
            detailLoading.value = false;
        }
    }

    // ==== State cho tuỳ chọn người dùng (Chỉ giữ Qty) ====
    const qty = ref(1); 

    // ==== Computed (Giá cơ bản) ====
    const unitPrice = computed(() => product.value?.price || 0); 
    const total = computed(() => unitPrice.value * qty.value); 

    // ==== Hàm tăng giảm số lượng ====
    const dec = () => (qty.value = Math.max(1, qty.value - 1)); 
    const inc = () => (qty.value += 1); 

    // ==== Trả về ====
    return { 
        product, qty, 
        unitPrice, total, 
        dec, inc, 
        detailLoading,
        detailError,
        loadDetail
    };
}