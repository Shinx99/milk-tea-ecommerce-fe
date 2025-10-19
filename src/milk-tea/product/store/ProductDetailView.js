// product/store/ProductDetailView.js
// NỘI DUNG HOÀN CHỈNH

import { ref, computed } from 'vue' 
import { fetchProductDetail } from '../api/productService' // Đã fix lỗi import đường dẫn tương đối
import { productState, getProductById } from './ProductsBase.js' 
import { addToCart } from '@/milk-tea/cart/store' 
import { useRouter } from 'vue-router' 

// Hàm composable dùng trong trang chi tiết sản phẩm
export function useProductDetail(productId) {
  // Sản phẩm sẽ được tải nếu cần (Khắc phục lỗi ReferenceError)
  const product = ref(getProductById(productId)) 
  const detailLoading = ref(false)
  const detailError = ref(null)

  // Hàm tải chi tiết sản phẩm (Dùng để gọi API nếu sản phẩm chưa có trong cache)
  async function loadDetail() {
      if (product.value) return; 
      
      detailLoading.value = true
      detailError.value = null

      try {
          const data = await fetchProductDetail(productId)
          product.value = data 
      } catch (err) {
          detailError.value = err.message || 'Không thể tải chi tiết sản phẩm.'
          console.error(err)
      } finally {
          detailLoading.value = false
      }
  }

  // ==== State cho tuỳ chọn người dùng (Phải được khai báo) ====
  const qty = ref(1) 
  const size = ref('S')
  const ice = ref('Bình thường')
  const extraIce = ref(false)

  // ==== Computed (biến phụ thuộc) ====
  const sizeDelta = computed(() => 
    size.value === 'M' ? 6000 : 
    size.value === 'L' ? 10000 : 0 
  )
  const unitPrice = computed(() => 
    (product.value?.price || 0) + sizeDelta.value 
  )
  const total = computed(() => unitPrice.value * qty.value) 

  // ==== Hàm tăng giảm số lượng ====
  const dec = () => (qty.value = Math.max(1, qty.value - 1)) 
  const inc = () => (qty.value += 1) 

  // ==== Xử lý thêm giỏ hàng (Đã fix lỗi useRouter ReferenceError) ====
  const router = useRouter() 
  function addToCartNow() {
    if (!product.value) return 
    
    // Gọi hàm thêm vào giỏ hàng
    addToCart(product.value, { 
      qty: qty.value, 
      unitPrice: unitPrice.value, 
      options: { 
        size: size.value,
        sugar: sugar.value,
        ice: ice.value,
        extraIce: extraIce.value
      }
    })
    
    // Điều hướng rõ ràng về trang danh sách sản phẩm
    router.push({ path: '/products' }) 
  }

  // ==== Trả về để component Vue dùng ====
  return { 
    product, 
    qty, 
    size, 
    ice, 
    extraIce, 
    unitPrice, 
    total, 
    dec, 
    inc, 
    addToCartNow,
    detailLoading,
    detailError,
    loadDetail // Trả về hàm loadDetail để View có thể gọi
  }
}