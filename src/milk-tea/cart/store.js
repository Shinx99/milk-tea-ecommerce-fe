// Giỏ hàng FE tĩnh (Vue 3) – tách theo người dùng
import { reactive, watch, computed } from "vue"
import { useUserStore } from "@/milk-tea/account/store" // Dùng Pinia store cho user
import axios from 'axios'


// === Axious client cho cart API (nếu cần) ===
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

http.interceptors.request.use((config) => {

  const token = localStorage.getItem('token')
  if(token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// === Helpers & APIs giỏ hàng của Customer ===
function readCartFromStorage(key) {
  try{
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function writeCartToStorage(key, items) {
  localStorage.setItem(key, JSON.stringify(items))
}

function guestKey() {
  return 'mt_cart_guest'
}

// === State chính ===
export const cartState = reactive({
  //serverItems: [], // Dùng khi có API
  loading: false,
  error: null,
  activeItems: [],
  saveItems: [],
  summary: null,

  //guest cart
  storageKey: guestKey(),
  guestItems: [],
})

// === Khởi tạo theo state login ===
export async function setupCart() {
  const userStore = useUserStore()
  if(userStore.userInfo?.id && localStorage.getItem('token')) {
    await fetchCartFromServer()
  } else {
    cartState.storageKey = guestKey()
    cartState.guestItems = readCartFromStorage(cartState.storageKey)
  }
}

export function watchCartUser() {
  const userStore = useUserStore()
  watch(() => userStore.userInfo?.id, async (id) => {
    if (id && localStorage.getItem('token')) {
      await fetchCartFromServer()
    } else {
      cartState.storageKey = guestKey()
      cartState.guestItems = readCartFromStorage(cartState.storageKey)
    }
  })
}
// === Call API server ===

//GET/api/carts
export async function fetchCartFromServer() {
  cartState.loading = true
  cartState.error = null
  try {
    const res = await http.get('/carts')
    const data = res.data.data
    cartState.activeItems = data.activeItems || []
    cartState.saveItems = data.saveForLaterItems || []
    cartState.summary = data
    console.log('activeItems from API', cartState.activeItems) // debug
  } catch (e) {
    console.error(e)
    cartState.error = 'Không tải được giỏ hàng.'
    cartState.activeItems = []
    cartState.saveItems = []
    cartState.summary = null
  } finally {
    cartState.loading = false
  }
  
}

// POST /api/carts/add
export async function addToCartServer(payload) {
  const res = await http.post('/carts/add', payload)
  await fetchCartFromServer()
  return res.data.data
}

// PUT /api/carts/{cartItemId}
export async function updateCartItemServer(cartItemId, payload) {
  const res = await http.put(`/carts/${cartItemId}`, payload)
  await fetchCartFromServer()
  return res.data.data
}

// DELETE /api/carts/remove
export async function removeCartItemsServer(cartItemIds) {
  await http.delete('/carts/remove', { data: { cartItemIds } })
  await fetchCartFromServer()
}

// DELETE /api/carts/clear
export async function clearCartServer() {
  await http.delete('/carts/clear')
  await fetchCartFromServer()
}

// PUT /api/carts/{id}/save-for-later
export async function saveForLaterServer(cartItemId) {
  const res = await http.put(`/carts/${cartItemId}/save-for-later`)
  await fetchCartFromServer()
  return res.data.data
}

// PUT /api/carts/{id}/move-to-active
export async function moveToActiveServer(cartItemId) {
  const res = await http.put(`/carts/${cartItemId}/move-to-active`)
  await fetchCartFromServer()
  return res.data.data
}

/* =========================
   6) Guest cart (chưa login)
   ========================= */
function makeItemKey(product, options = {}) {
  const {
    size = 'S',
    sugar = 'bt',
    tea = 'bt',
    ice = 'bt',
    extraIce = false,
  } = options
  return [product.id, size, sugar, tea, ice, extraIce ? 'extraIce' : ''].join('|')
}

export function addToCartGuest(
  product,
  { qty = 1, unitPrice = product.price, options = {} } = {}
) {
  const key = makeItemKey(product, options)
  const found = cartState.guestItems.find((it) => it.key === key)

  if (found) {
    found.qty += qty
  } else {
    cartState.guestItems.push({
      key,
      id: product.id,
      name: product.name,
      image: product.image,
      price: unitPrice,
      qty,
      options,
    })
  }
  writeCartToStorage(cartState.storageKey, cartState.guestItems)
}

export function updateQtyGuest(key, qty) {
  const it = cartState.guestItems.find((i) => i.key === key)
  if (!it) return
  it.qty = Number(qty) || 0
  if (it.qty <= 0) removeFromCartGuest(key)
  else writeCartToStorage(cartState.storageKey, cartState.guestItems)
}

export function removeFromCartGuest(key) {
  cartState.guestItems = cartState.guestItems.filter((i) => i.key !== key)
  writeCartToStorage(cartState.storageKey, cartState.guestItems)
}

export function clearCartGuest() {
  cartState.guestItems = []
  writeCartToStorage(cartState.storageKey, cartState.guestItems)
}

/* =========================
   7) Computed
   ========================= */

export const cartCount = computed(() => {
  if (cartState.summary) {
    return cartState.activeItems.reduce(
      (sum, i) => sum + (Number(i.quantity) || 0),
      0
    )
  }
  return cartState.guestItems.reduce(
    (sum, i) => sum + (Number(i.qty) || 0),
    0
  )
})

export const cartTotal = computed(() => {
  if (cartState.summary) return cartState.summary.total ?? 0
  return cartState.guestItems.reduce((sum, i) => sum + i.price * i.qty, 0)
})


    



