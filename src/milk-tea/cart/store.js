import { ref, computed } from 'vue'
import { useUserStore } from '@/milk-tea/account/store'
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItem,
  removeCartItem
} from './api/cartService'

export const cartItems = ref([])

/**
 * Tổng số lượng sản phẩm trong giỏ
 */
export const cartCount = computed(() =>
  cartItems.value.reduce((sum, i) => sum + (Number(i.qty) || 0), 0)
)

/**
 * Tổng tiền giỏ hàng
 */
export const cartTotal = computed(() =>
  cartItems.value.reduce((sum, i) => sum + i.price * i.qty, 0)
)

/**
 * Lấy userId từ store hoặc localStorage
 */
function getCurrentUserId() {
  const storeId = useUserStore().userInfo?.userId || useUserStore().userInfo?.id
  const localId = localStorage.getItem('userId')
  return storeId || localId
}

/**
 * Tải giỏ hàng từ backend
 */
export async function loadCart() {
  const userId = getCurrentUserId()
  if (!userId) return
  try {
    const data = await fetchCart()
    cartItems.value = data || []
  } catch (err) {
    console.error('❌ Lỗi khi tải giỏ hàng:', err)
  }
}

/**
 * Thêm sản phẩm vào giỏ hàng
 */
export async function addToCart(product, options = {}, qty = 1) {
  try {
    await apiAddToCart(product, options, qty)
    await loadCart()
  } catch (err) {
    console.error('❌ Lỗi khi thêm vào giỏ hàng:', err)
  }
}

/**
 * Cập nhật số lượng sản phẩm
 */
export async function updateQty(cartId, newQty) {
  try {
    await updateCartItem(cartId, newQty)
    await loadCart()
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật số lượng:', err)
  }
}

/**
 * Xóa sản phẩm khỏi giỏ hàng
 */
export async function removeFromCart(cartId) {
  try {
    await removeCartItem(cartId)
    await loadCart()
  } catch (err) {
    console.error('❌ Lỗi khi xóa sản phẩm:', err)
  }
}

/**
 * Xóa toàn bộ giỏ hàng
 */
export async function clearCart() {
  for (const item of cartItems.value) {
    await removeFromCart(item.id)
  }
}