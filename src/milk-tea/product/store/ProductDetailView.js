import { ref, computed } from 'vue' 
import { fetchProductDetail } from '../api/ProductService'
import { getProductById } from '../store/ProductsBase' // Lấy hàm kiểm tra cache

// Hàm composable dùng trong trang chi tiết sản phẩm
export function useProductDetail(productId) {
    // Lấy sản phẩm từ cache trước (nếu có)
    const product = ref(getProductById(productId)) 
    const detailLoading = ref(false)
    const detailError = ref(null)

    async function loadDetail(idToLoad) {
        const currentId = idToLoad || productId;
        
        // Logic kiểm tra cache: Nếu sản phẩm đã có và ID khớp, KHÔNG làm gì (return)
        if (product.value && String(product.value.id) === String(currentId)) return; 
        
        product.value = null; // Reset để hiển thị loading
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

    // ==== State cho số lượng (Qty) ====
    const qty = ref(1); 

    // ==== Computed (Tính toán giá) ====
    const unitPrice = computed(() => product.value?.price || 0); 
    // Tổng tiền = Giá * Số lượng
    const total = computed(() => unitPrice.value * qty.value); 

    // ==== Hàm tăng giảm số lượng ====
    const dec = () => (qty.value = Math.max(1, qty.value - 1)); // Đảm bảo qty >= 1
    const inc = () => (qty.value += 1); 

    // ==== Trả về tất cả state và hàm cần thiết ====
    return { 
        product, qty, 
        unitPrice, total, 
        dec, inc, 
        detailLoading,
        detailError,
        loadDetail
    };
}