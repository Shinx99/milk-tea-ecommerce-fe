// src/milk-tea/product/store.js
// Quản lý sản phẩm đơn giản bằng reactive + localStorage

import { reactive, computed } from 'vue'
import { seedProducts } from './data/products'

// Khóa localStorage
const LS_PRODUCTS = 'mt_products'

// ----------------- Helpers -----------------
function loadProducts() {
  try {
    const raw = localStorage.getItem(LS_PRODUCTS)
    if (raw) return JSON.parse(raw)
  } catch (_) {}

  // Nếu chưa có thì seed dữ liệu
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(seedProducts))
  return [...seedProducts]
}

function saveProducts(list) {
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(list))
}

// ----------------- State -----------------
export const productState = reactive({
  list: loadProducts(), // danh sách gốc
  keyword: '',
  category: 'All',
  sort: 'popular', // popular | price_asc | price_desc | name | sales
  priceMin: 0,
  priceMax: 0,
})

// Lấy danh sách category
export const categories = computed(() => {
  return ['All', ...new Set(productState.list.map(p => p.category))]
})

// ----------------- Xử lý search + filter + sort -----------------
function normalize(str = '') {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const filteredProducts = computed(() => {
  let arr = [...productState.list]

  // Tìm theo từ khóa
  const kw = normalize(productState.keyword)
  if (kw) {
    arr = arr.filter(p =>
      normalize(p.name).includes(kw) || normalize(p.desc || '').includes(kw)
    )
  }

  // Lọc theo category
  if (productState.category !== 'All') {
    arr = arr.filter(p => p.category === productState.category)
  }

  // Lọc theo giá
  if (productState.priceMin > 0) arr = arr.filter(p => p.price >= productState.priceMin)
  if (productState.priceMax > 0) arr = arr.filter(p => p.price <= productState.priceMax)

  // Sắp xếp
  switch (productState.sort) {
    case 'price_asc':  arr.sort((a, b) => a.price - b.price); break
    case 'price_desc': arr.sort((a, b) => b.price - a.price); break
    case 'name':       arr.sort((a, b) => a.name.localeCompare(b.name)); break
    case 'sales':      arr.sort((a, b) => (b.salesCount||0) - (a.salesCount||0)); break
    default:           arr.sort((a, b) => b.id - a.id); // popular = mới nhất
  }
  return arr
})

// ----------------- API -----------------

// Lấy sản phẩm theo id
export function getProductById(id) {
  return productState.list.find(p => String(p.id) === String(id)) || null
}

// Ghi nhận mua hàng (tăng salesCount)
export function recordPurchase(id, qty = 1) {
  const p = getProductById(id)
  if (!p) return
  p.salesCount = (p.salesCount || 0) + qty
  saveProducts(productState.list)
}

// Thêm mới
export function addProduct(data) {
  const id = productState.list.length ? Math.max(...productState.list.map(p => p.id)) + 1 : 1
  const p = { id, salesCount: 0, ...data }
  productState.list.push(p)
  saveProducts(productState.list)
  return p
}

// Sửa
export function updateProduct(id, patch) {
  const i = productState.list.findIndex(p => p.id === id)
  if (i < 0) return null
  productState.list[i] = { ...productState.list[i], ...patch }
  saveProducts(productState.list)
  return productState.list[i]
}

// Xóa
export function removeProduct(id) {
  productState.list = productState.list.filter(p => p.id !== id)
  saveProducts(productState.list)
}
