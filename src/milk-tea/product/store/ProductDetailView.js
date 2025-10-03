import { ref, computed } from 'vue'                   // import API reactivity của Vue 3
import { getProductById } from './productsBase.js'   // hàm lấy sản phẩm theo id từ store products
import { addToCart } from '@/milk-tea/cart/store'    // hàm thêm vào giỏ hàng từ module cart
import { useRouter } from 'vue-router'               // hook của Vue Router để điều hướng

// Hàm composable dùng trong trang chi tiết sản phẩm
export function useProductDetail(productId) {
  const product = ref(getProductById(productId))     // reactive: lưu sản phẩm hiện tại (tìm theo id)

  // ==== State cho tuỳ chọn người dùng ====
  const qty = ref(1)                                // số lượng (mặc định 1)
  const size = ref('S')                             // size cốc: S, M, L (mặc định S)
  const sugar = ref('Bình thường')                  // mức đường
  const ice = ref('Bình thường')                    // mức đá
  const extraIce = ref(false)                       // có thêm đá không (true/false)

  // ==== Computed (biến phụ thuộc) ====
  const sizeDelta = computed(() =>                  // số tiền cộng thêm theo size
    size.value === 'M' ? 6000 :                     // nếu size M → cộng 6000đ
    size.value === 'L' ? 10000 : 0                  // nếu size L → cộng 10000đ
  )
  const unitPrice = computed(() =>                  // giá 1 cốc sau khi chọn size
    (product.value?.price || 0) + sizeDelta.value   // giá gốc + phụ thu theo size
  )
  const total = computed(() => unitPrice.value * qty.value) // tổng tiền = đơn giá × số lượng

  // ==== Hàm tăng giảm số lượng ====
  const dec = () => (qty.value = Math.max(1, qty.value - 1)) // giảm số lượng (không < 1)
  const inc = () => (qty.value += 1)                         // tăng số lượng

  // ==== Xử lý thêm giỏ hàng ====
  const router = useRouter()       // khởi tạo router để điều hướng
                      
  function addToCartNow() {
    if (!product.value) return                        // nếu không có sản phẩm thì dừng
    addToCart(product.value, {                        // gọi hàm thêm sản phẩm vào giỏ
      qty: qty.value,                                 // số lượng
      unitPrice: unitPrice.value,                     // giá sau khi tính size
      options: {                                      // tuỳ chọn thêm
        size: size.value,
        sugar: sugar.value,
        ice: ice.value,
        extraIce: extraIce.value
      }
    })
    router.back()                                     // quay lại trang trước sau khi thêm
  }

  // ==== Trả về để component Vue dùng ====
  return { product, qty, size, sugar, ice, extraIce, 
           unitPrice, total, dec, inc, addToCartNow }
}
