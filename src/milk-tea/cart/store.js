// Giỏ hàng FE tĩnh (Vue 3) – tách theo người dùng                    // Front-end cart (Vue 3) per-user
// - Hiện tại: lưu localStorage                                        // Currently stored in localStorage
// - Sau này: thay 2 hàm load/save bằng gọi API backend                // Later: swap read/write with API calls
//
// Cấu trúc item trong giỏ:                                            // Cart item shape:
// { key, id, name, image, price, qty, options }                       // key + product info + options

import { reactive, watch, computed } from 'vue'                        // Vue reactivity APIs
import { authState } from '@/milk-tea/account/store'                   // Auth store: currentUser, ...

/* =========================================
   1) Khóa giỏ theo người dùng                                         // Build storage key per-user
   - Khách:   'mt_cart_guest'                                          // Guest key
   - User id=7: 'mt_cart_7'                                            // User key
   ========================================= */
function cartKey() {
  const id = authState.currentUser?.id                                 // user id if logged in
  return id ? `mt_cart_${id}` : 'mt_cart_guest'                        // choose per-user or guest key
}

/* =========================================
   2) LỚP LƯU/ĐỌC (HIỆN TẠI: localStorage)                             // Persistence layer (localStorage)
   -> Điểm thay thế duy nhất khi nối API                               // Single swap point for backend
   ========================================= */
function readCartFromStorage(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') }         // parse or return []
  catch { return [] }                                                  // safe fallback on JSON error
}
function writeCartToStorage(key, items) {
  localStorage.setItem(key, JSON.stringify(items))                     // serialize cart to LS
}

// (OPTION) Khi có backend, đổi 2 hàm bên dưới:                         // With backend, replace below:
// async function fetchCartFromAPI(userId) { ... }                      // fetch from server
// async function saveCartToAPI(userId, items) { ... }                  // save to server

/* =========================================
   3) STATE chính                                                       // Main reactive state
   ========================================= */
export const cartState = reactive({
  storageKey: cartKey(),                                               // which key we’re using now
  items: readCartFromStorage(cartKey()),                               // current cart items for that key
})

/* Khi đăng nhập/đăng xuất:                                            // On login/logout:
   - đổi storageKey                                                    //  update storageKey
   - nạp giỏ tương ứng (guest hoặc user)                               //  load corresponding cart
*/
watch(
  () => authState.currentUser?.id,                                     // watch user id changes
  () => {
    cartState.storageKey = cartKey()                                   // recompute storage key
    cartState.items = readCartFromStorage(cartState.storageKey)        // load items for that key
    // Sau này: await fetchCartFromAPI(authState.currentUser?.id)       // later: fetch from API
  }
)

/* =========================================
   4) Tạo key duy nhất cho item (để cộng dồn đúng biến thể)            // Unique item key (variant-aware)
   - Cùng sản phẩm nhưng khác size/đường/đá là item khác                // same product, different options → new item
   ========================================= */
function makeItemKey(product, options = {}) {
  const { size = 'S', sugar = 'bt', tea = 'bt', ice = 'bt', extraIce = false } = options // normalize opts
  return [product.id, size, sugar, tea, ice, extraIce ? 'extraIce' : ''].join('|')       // stable compound key
}

/* =========================================
   5) APIs giỏ – dùng trong UI                                          // Cart APIs for UI components
   -> Sau này chỉ cần thay writeCartToStorage = saveCartToAPI           // Later: swap persistence calls
   ========================================= */

// Thêm vào giỏ                                                         // Add to cart
export function addToCart(product, { qty = 1, unitPrice = product.price, options = {} } = {}) {
  const key = makeItemKey(product, options)                            // compute variant key
  const found = cartState.items.find(it => it.key === key)             // find existing item

  if (found) {
    found.qty += qty                                                   // increase quantity if exists
  } else {
    cartState.items.push({                                             // push a brand-new cart line
      key,                                                             // unique key
      id: product.id,                                                  // product id
      name: product.name,                                              // product name
      image: product.image,                                            // product image URL
      price: unitPrice,                                                // unit price (already sized)
      qty,                                                             // quantity
      options                                                          // selected options
    })
  }
  writeCartToStorage(cartState.storageKey, cartState.items)            // persist to LS (or API later)
}

// Cập nhật số lượng                                                    // Update quantity
export function updateQty(key, qty) {
  const it = cartState.items.find(i => i.key === key)                  // locate item by key
  if (!it) return                                                      // nothing to update
  it.qty = Number(qty) || 0                                            // coerce to number, fallback 0
  if (it.qty <= 0) removeFromCart(key)                                 // remove if non-positive
  else writeCartToStorage(cartState.storageKey, cartState.items)       // otherwise persist
}

// Xóa 1 món                                                            // Remove a single item
export function removeFromCart(key) {
  cartState.items = cartState.items.filter(i => i.key !== key)         // filter out target item
  writeCartToStorage(cartState.storageKey, cartState.items)            // persist change
}

// Xóa sạch giỏ                                                         // Clear entire cart
export function clearCart() {
  cartState.items = []                                                 // reset to empty
  writeCartToStorage(cartState.storageKey, cartState.items)            // persist empty cart
}

// Tổng số lượng (badge Header)                                         // Total item count (for header badge)
export const cartCount = computed(() =>
  cartState.items.reduce((sum, i) => sum + (Number(i.qty) || 0), 0)    // sum of quantities (safe number)
)

// Tổng tiền                                                            // Cart grand total
export const cartTotal = computed(() =>
  cartState.items.reduce((sum, i) => sum + i.price * i.qty, 0)         // Σ price × qty
)

/* =========================================
   6) (Tuỳ chọn) Gộp giỏ guest vào giỏ user khi login                   // Optional: merge guest cart on login
   - Gọi sau khi login nếu muốn giữ hàng đã chọn trước đó               // Call after successful login
   ========================================= */
export function mergeGuestCartIntoUser() {
  const guest = readCartFromStorage('mt_cart_guest')                   // read guest cart
  const userKey = `mt_cart_${authState.currentUser?.id}`               // target user key
  const userItems = readCartFromStorage(userKey)                       // existing user cart

  const map = new Map(userItems.map(i => [i.key, i]))                  // map by key for fast merge
  for (const g of guest) {                                             // iterate guest items
    if (map.has(g.key)) map.get(g.key).qty += g.qty                    // combine quantities if same variant
    else map.set(g.key, g)                                             // otherwise add as new line
  }
  const merged = [...map.values()]                                     // merged array
  writeCartToStorage(userKey, merged)                                  // persist merged user cart

  // Chuyển state hiện tại sang giỏ user                                // Switch current state to user cart
  cartState.storageKey = userKey
  cartState.items = merged

  // (tuỳ chọn) dọn giỏ guest                                           // Optional: clear guest cart
  // localStorage.removeItem('mt_cart_guest')
}
