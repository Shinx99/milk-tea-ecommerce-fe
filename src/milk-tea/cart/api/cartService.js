import axios from '@/api/apiClient'
import { useUserStore } from '@/milk-tea/account/store'

// Hàm lấy userId từ store hoặc localStorage
function getCurrentCustomerId() {
  const storeId = useUserStore().userInfo?.userId || useUserStore().userInfo?.id
  const localId = localStorage.getItem('userId')
  const id = storeId || localId
  console.log('🧾 customerId:', id)
  return id
}

// ✅ Thêm sản phẩm vào giỏ hàng, có kèm userId
export async function addToCart(product, qty) {
  const userId = getCurrentCustomerId()

  const payload = {
    userId, // ✅ thêm userId vào payload
    productId: product.id,
    quantity: qty,
    price: product.price,
    //options
  }

  console.log('📦 Gửi lên:', payload)

  try {
    await axios.post(`/api/cart`, payload)
  } catch (err) {
    console.error('❌ Lỗi khi thêm vào giỏ hàng:', err.response?.status, err.response?.data)
    throw err
  }
}

// ✅ Lấy giỏ hàng theo userId
export async function fetchCart() {
  const customerId = getCurrentCustomerId()
  const res = await axios.get(`/api/cart/${customerId}`)
  return res.data
}

// ✅ Cập nhật số lượng sản phẩm trong giỏ
export async function updateCartItem(cartId, newQty) {
  await axios.put(`/api/cart/update/${cartId}`, { quantity: newQty })
}

// ✅ Xóa sản phẩm khỏi giỏ
export async function removeCartItem(cartId) {
  await axios.delete(`/api/cart/remove/${cartId}`)
}

