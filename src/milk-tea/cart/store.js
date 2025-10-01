// src/milk-tea/cart/store.js
// Giỏ hàng đơn giản dùng reactive + localStorage (chưa có backend)

import { reactive, watch } from 'vue'
import { authState } from '@/milk-tea/account/store'

/* =========================
   1) Helper: tạo "khóa giỏ" theo người dùng
   - Khách:   mt_cart_guest
   - Người dùng có id=1: mt_cart_1
   ========================= */
function getCartKey() {
  const uid = authState.currentUser?.id
  return uid ? `mt_cart_${uid}` : 'mt_cart_guest'
}

/* =========================
   2) Helper: đọc/ghi giỏ theo key
   ========================= */
function loadCart(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}
function saveCart(key, items) {
  localStorage.setItem(key, JSON.stringify(items))
}

/* =========================
   3) State chính của giỏ hàng
   - storageKey: đang dùng key nào (guest hay user-<id>)
   - items: danh sách món trong giỏ
     Mỗi món: { key, id, name, image, price, qty, options }
   ========================= */
export const cartState = reactive({
  storageKey: getCartKey(),
  items: loadCart(getCartKey()),
})

/* Khi đăng nhập / đăng xuất
   -> đổi storageKey
   -> nạp lại giỏ tương ứng */
watch(
  () => authState.currentUser?.id,
  () => {
    cartState.storageKey = getCartKey()
    cartState.items = loadCart(cartState.storageKey)
  }
)

/* =========================
   4) Tạo "key" duy nhất cho item
   - cùng sản phẩm nhưng khác size/đường/đá... là món khác
   ========================= */
function makeItemKey(product, options) {
  return [
    product.id,
    options?.size ?? 'S',
    options?.sugar ?? 'bt',
    options?.tea ?? 'bt',
    options?.ice ?? 'bt',
    options?.extraIce ? 'extraIce' : ''
  ].join('|')
}

/* =========================
   5) APIs thao tác giỏ
   ========================= */

// Thêm vào giỏ
export function addToCart(product, { qty = 1, unitPrice = product.price, options = {} } = {}) {
  const key = makeItemKey(product, options)
  const found = cartState.items.find(i => i.key === key)

  if (found) {
    found.qty += qty
  } else {
    cartState.items.push({
      key,
      id: product.id,
      name: product.name,
      image: product.image,
      price: unitPrice,
      qty,
      options
    })
  }

  saveCart(cartState.storageKey, cartState.items)
}

// Cập nhật số lượng
export function updateQty(key, qty) {
  const item = cartState.items.find(i => i.key === key)
  if (!item) return
  item.qty = qty
  if (item.qty <= 0) {
    removeFromCart(key)
  } else {
    saveCart(cartState.storageKey, cartState.items)
  }
}

// Xoá 1 món khỏi giỏ
export function removeFromCart(key) {
  cartState.items = cartState.items.filter(i => i.key !== key)
  saveCart(cartState.storageKey, cartState.items)
}

// Xoá sạch giỏ
export function clearCart() {
  cartState.items = []
  saveCart(cartState.storageKey, cartState.items)
}

// Tổng tiền
export function cartTotal() {
  return cartState.items.reduce((sum, i) => sum + i.price * i.qty, 0)
}

// Tổng số lượng (badge ở Header)
export function cartCount() {
  return cartState.items.reduce((sum, i) => sum + i.qty, 0)
}

/* =========================
   (Tùy chọn) Gộp giỏ khách vào giỏ user khi đăng nhập
   - Gọi hàm này ngay sau khi login nếu muốn
   =========================
export function mergeGuestCartIntoUser() {
  const guestItems = loadCart('mt_cart_guest')
  const userKey = `mt_cart_${authState.currentUser?.id}`
  const userItems = loadCart(userKey)

  const map = new Map(userItems.map(i => [i.key, i]))
  for (const g of guestItems) {
    if (map.has(g.key)) map.get(g.key).qty += g.qty
    else map.set(g.key, g)
  }
  const merged = [...map.values()]
  saveCart(userKey, merged)

  // cập nhật state hiện tại sang giỏ user
  cartState.storageKey = userKey
  cartState.items = merged

  // (tuỳ chọn) xoá giỏ guest
  // localStorage.removeItem('mt_cart_guest')
}
*/
