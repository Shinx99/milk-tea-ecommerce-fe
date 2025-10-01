// Giỏ hàng tách riêng theo user hoặc guest
import { reactive, watch } from 'vue'
import { authState } from '@/milk-tea/account/store'

// ===== Helpers cho LocalStorage theo người dùng =====
function cartKey() {
  // khách: mt_cart_guest ; user: mt_cart_<id>
  const uid = authState.currentUser?.id
  return uid ? `mt_cart_${uid}` : 'mt_cart_guest'
}

function loadCartByKey(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function saveCartByKey(key, items) {
  localStorage.setItem(key, JSON.stringify(items))
}

// ====== STATE CHÍNH ======
export const cartState = reactive({
  storageKey: cartKey(),            // khoá hiện tại
  items: loadCartByKey(cartKey()),  // [{key,id,name,image,price,qty,options}]
})

// Khi đổi trạng thái đăng nhập → tự chuyển giỏ sang khoá tương ứng
watch(
  () => authState.currentUser?.id,   // user id (hoặc undefined khi logout)
  () => {
    cartState.storageKey = cartKey()
    cartState.items = loadCartByKey(cartState.storageKey)
  }
)

// ===== Logic tạo key và thao tác với cart =====
function buildItemKey(product, options) {
  return [
    product.id,
    options?.size ?? 'S',
    options?.sugar ?? '',
    options?.tea ?? '',
    options?.ice ?? '',
    options?.extraIce ? 'extraIce' : ''
  ].join('|')
}

export function addToCart(product, { qty = 1, unitPrice = product.price, options = {} } = {}) {
  const k = buildItemKey(product, options)
  const found = cartState.items.find(i => i.key === k)
  if (found) {
    found.qty += qty
  } else {
    cartState.items.push({
      key: k,
      id: product.id,
      name: product.name,
      image: product.image,
      price: unitPrice,
      qty,
      options
    })
  }
  saveCartByKey(cartState.storageKey, cartState.items)
}

export function updateQty(key, qty) {
  const it = cartState.items.find(i => i.key === key)
  if (!it) return
  it.qty = qty
  if (it.qty <= 0) removeFromCart(key)
  saveCartByKey(cartState.storageKey, cartState.items)
}

export function removeFromCart(key) {
  cartState.items = cartState.items.filter(i => i.key !== key)
  saveCartByKey(cartState.storageKey, cartState.items)
}

export function clearCart() {
  cartState.items = []
  saveCartByKey(cartState.storageKey, cartState.items)
}

export function cartTotal() {
  return cartState.items.reduce((s, i) => s + i.price * i.qty, 0)
}

export function cartCount() {
  return cartState.items.reduce((s, i) => s + i.qty, 0)
}

/* ==============
   (Tuỳ chọn) Nếu sau này bạn muốn gộp giỏ khách vào giỏ user khi login,
   chỉ cần dùng hàm này trong nơi xử lý đăng nhập:
   ==============
export function mergeGuestCartIntoUser() {
  const guest = loadCartByKey('mt_cart_guest')
  const userKey = `mt_cart_${authState.currentUser?.id}`
  const user = loadCartByKey(userKey)
  const map = new Map(user.map(i => [i.key, i]))
  for (const g of guest) {
    if (map.has(g.key)) map.get(g.key).qty += g.qty
    else map.set(g.key, g)
  }
  const merged = Array.from(map.values())
  saveCartByKey(userKey, merged)
  // Chuyển state hiện tại sang giỏ user
  cartState.storageKey = userKey
  cartState.items = merged
  // Xoá giỏ guest nếu muốn:
  // localStorage.removeItem('mt_cart_guest')
}
*/
