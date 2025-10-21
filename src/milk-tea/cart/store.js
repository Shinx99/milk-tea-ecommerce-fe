// Giỏ hàng FE tĩnh (Vue 3) – tách theo người dùng
import { reactive, watch, computed } from "vue"
import { useUserStore } from "@/milk-tea/account/store" // Dùng Pinia store cho user

/* =========================================
   1) Khóa giỏ theo người dùng
   ========================================= */
// Không gọi useUserStore ở ngoài cùng, khai báo trong function!
function cartKey() {
  // Khởi tạo store mỗi lần gọi hàm (safe cho Pinia)
  const userStore = useUserStore()
  const id = userStore.userInfo?.id
  return id ? `mt_cart_${id}` : 'mt_cart_guest'
}

/* =========================================
   2) LỚP LƯU/ĐỌC (HIỆN TẠI: localStorage)
   ========================================= */
function readCartFromStorage(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') }
  catch { return [] }
}
function writeCartToStorage(key, items) {
  localStorage.setItem(key, JSON.stringify(items))
}

/* =========================================
   3) STATE chính
   ========================================= */
export const cartState = reactive({
  storageKey: '',                // sẽ được set ở mounted
  items: [],                     // sẽ được set ở mounted
})

// Gọi thiết lập giỏ đúng lúc runtime khi đã có Pinia
export function setupCart() {
  cartState.storageKey = cartKey()
  cartState.items = readCartFromStorage(cartState.storageKey)
}

// Phải gọi setupCart() ở component setup() hoặc App.vue mounted
// VD ở App.vue:
// import { setupCart } from '@/milk-tea/cart/store';
// onMounted(() => { setupCart() })

/* Khi đăng nhập/đăng xuất: đổi storageKey, nạp giỏ tương ứng */
export function watchCartUser() {
  // Phải gọi trong setup()/mounted của component
  const userStore = useUserStore()
  watch(
    () => userStore.userInfo?.id,
    () => {
      cartState.storageKey = cartKey()
      cartState.items = readCartFromStorage(cartState.storageKey)
      // Sau này: await fetchCartFromAPI(userStore.userInfo?.id)
    }
  )
}

/* =========================================
   4) Tạo key duy nhất cho item
   ========================================= */
function makeItemKey(product, options = {}) {
  const { size = 'S', sugar = 'bt', tea = 'bt', ice = 'bt', extraIce = false } = options
  return [product.id, size, sugar, tea, ice, extraIce ? 'extraIce' : ''].join('|')
}

/* =========================================
   5) APIs giỏ – dùng trong UI
   ========================================= */
export function addToCart(product, { qty = 1, unitPrice = product.price, options = {} } = {}) {
  const key = makeItemKey(product, options)
  const found = cartState.items.find(it => it.key === key)

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
  writeCartToStorage(cartState.storageKey, cartState.items)
}

export function updateQty(key, qty) {
  const it = cartState.items.find(i => i.key === key)
  if (!it) return
  it.qty = Number(qty) || 0
  if (it.qty <= 0) removeFromCart(key)
  else writeCartToStorage(cartState.storageKey, cartState.items)
}

export function removeFromCart(key) {
  cartState.items = cartState.items.filter(i => i.key !== key)
  writeCartToStorage(cartState.storageKey, cartState.items)
}

export function clearCart() {
  cartState.items = []
  writeCartToStorage(cartState.storageKey, cartState.items)
}

export const cartCount = computed(() =>
  cartState.items.reduce((sum, i) => sum + (Number(i.qty) || 0), 0)
)

export const cartTotal = computed(() =>
  cartState.items.reduce((sum, i) => sum + i.price * i.qty, 0)
)

/* =========================================
   6) (Tuỳ chọn) Gộp giỏ guest vào giỏ user khi login
   ========================================= */
export function mergeGuestCartIntoUser() {
  const userStore = useUserStore()
  const guest = readCartFromStorage('mt_cart_guest')
  const userKey = `mt_cart_${userStore.userInfo?.id}`
  const userItems = readCartFromStorage(userKey)

  const map = new Map(userItems.map(i => [i.key, i]))
  for (const g of guest) {
    if (map.has(g.key)) map.get(g.key).qty += g.qty
    else map.set(g.key, g)
  }
  const merged = [...map.values()]
  writeCartToStorage(userKey, merged)
  cartState.storageKey = userKey
  cartState.items = merged
  // Optional: clear guest cart
  // localStorage.removeItem('mt_cart_guest')
}
