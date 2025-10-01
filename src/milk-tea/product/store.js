import { reactive, computed } from 'vue'
import { seedProducts } from './data/products'

const LS_PRODUCTS = 'mt_products'
const HOT_TOP_K = 3 // ← số lượng món được gắn Hot (top bán chạy)

// helpers lưu/đọc
function loadProducts() {
  try {
    const raw = localStorage.getItem(LS_PRODUCTS)
    if (!raw) {
      const seeded = seedProducts.map(p => ({ ...p, isHot: false }))
      localStorage.setItem(LS_PRODUCTS, JSON.stringify(seeded))
      return seeded
    }
    return JSON.parse(raw)
  } catch {
    return seedProducts.map(p => ({ ...p, isHot: false }))
  }
}
function saveProducts(list) {
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(list))
}

// gắn cờ Hot theo top K salesCount
function recomputeHotFlags(list) {
  // clone & sort theo salesCount desc
  const sorted = [...list].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
  const cutoffIds = new Set(sorted.slice(0, HOT_TOP_K).map(p => p.id))
  for (const p of list) p.isHot = cutoffIds.has(p.id)
}

export const productState = reactive({
  list: loadProducts(),
  keyword: '',
  category: 'All',
  sort: 'popular', // popular | price_asc | price_desc | name | sales
  priceMin: 0,
  priceMax: 0,
})

// đảm bảo cờ Hot đúng khi khởi tạo
recomputeHotFlags(productState.list)
saveProducts(productState.list)

export const categories = computed(() => {
  return ['All', ...Array.from(new Set(productState.list.map(p => p.category)))]
})

// search helpers
function normalize(str = '') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
function fuzzySubseq(haystack, needle) {
  let i = 0, j = 0
  while (i < haystack.length && j < needle.length) {
    if (haystack[i] === needle[j]) j++
    i++
  }
  return j === needle.length
}

export const filteredProducts = computed(() => {
  let arr = [...productState.list]

  // search
  const kw = normalize(productState.keyword || '')
  if (kw) {
    arr = arr.filter(p => {
      const name = normalize(p.name)
      const desc = normalize(p.desc || '')
      return name.includes(kw) || desc.includes(kw) || fuzzySubseq(name, kw)
    })
  }

  // category
  if (productState.category !== 'All') {
    arr = arr.filter(p => p.category === productState.category)
  }

  // price range
  if (productState.priceMin > 0) arr = arr.filter(p => p.price >= productState.priceMin)
  if (productState.priceMax > 0) arr = arr.filter(p => p.price <= productState.priceMax)

  // sort
  switch (productState.sort) {
    case 'price_asc':  arr.sort((a,b)=>a.price-b.price); break
    case 'price_desc': arr.sort((a,b)=>b.price-a.price); break
    case 'name':       arr.sort((a,b)=>a.name.localeCompare(b.name)); break
    case 'sales':      arr.sort((a,b)=>(b.salesCount||0)-(a.salesCount||0)); break
    default:           arr.sort((a,b)=>Number(b.isHot)-Number(a.isHot)); // popular = Hot trước
  }
  return arr
})

// === API ===
export function getProductById(id) {
  return productState.list.find(p => String(p.id) === String(id)) || null
}

// Ghi nhận mua hàng (ví dụ sau này gọi ở Checkout)
export function recordPurchase(productId, qty = 1) {
  const p = productState.list.find(x => x.id === Number(productId))
  if (!p) return
  p.salesCount = (p.salesCount || 0) + Math.max(1, qty)
  recomputeHotFlags(productState.list)
  saveProducts(productState.list)
}

// (tuỳ chọn) quick simulate để test
export function simulateBuyMany(pairs /* [{id, qty}] */) {
  for (const { id, qty } of pairs) recordPurchase(id, qty)
}

// CRUD cơ bản (nếu cần admin)
export function addProduct(data) {
  const id = productState.list.length ? Math.max(...productState.list.map(p=>p.id))+1 : 1
  const p = { id, salesCount: 0, isHot: false, ...data }
  productState.list.push(p)
  recomputeHotFlags(productState.list)
  saveProducts(productState.list)
  return p
}
export function updateProduct(id, patch) {
  const i = productState.list.findIndex(p=>p.id===id); if (i<0) return null
  productState.list[i] = { ...productState.list[i], ...patch }
  recomputeHotFlags(productState.list)
  saveProducts(productState.list)
  return productState.list[i]
}
export function removeProduct(id) {
  productState.list = productState.list.filter(p=>p.id!==id)
  recomputeHotFlags(productState.list)
  saveProducts(productState.list)
}
