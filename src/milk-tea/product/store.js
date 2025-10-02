// src/milk-tea/product/store.js
// Store sản phẩm đơn giản cho frontend tĩnh
// - Dùng localStorage để lưu
// - Nếu chưa có dữ liệu thì fetch từ /product_data/products.json
// - Ảnh giữ nguyên tên file trong JSON, nhưng được map sang src/assets/images khi load

import { reactive, computed } from 'vue'

const LS_PRODUCTS = 'mt_products' // key để lưu trong localStorage

// ===== STATE chính =====
export const productState = reactive({
  list: [],        // danh sách sản phẩm
  keyword: '',     // từ khóa tìm kiếm
  category: 'All', // lọc theo loại
  sort: 'popular', // cách sắp xếp: popular | price_asc | price_desc | name
})

/** Chuyển đường dẫn ảnh trong JSON ("/assets/images/xxx.jpg")
 *  thành URL hợp lệ tới ảnh trong src/assets/images.
 *  Giữ nguyên nếu đã là URL tuyệt đối (http://...).
 */
function resolveImage(src) {
  if (!src) return src
  // Nếu đã là URL tuyệt đối (sau khi Vite xử lý) thì giữ nguyên
  if (typeof src === 'string' && src.includes('://')) return src

  // Lấy đúng tên file ảnh cuối cùng
  const filename = String(src).split('/').pop() || src
  // store.js nằm ở: src/milk-tea/product/store.js
  // => muốn trỏ tới src/assets/images => "../../assets/images/<file>"
  return new URL(`../../assets/images/${filename}`, import.meta.url).href
}

// ===== Hàm load dữ liệu =====
export async function loadProducts() {
  try {
    // 1) Nếu localStorage có thì lấy luôn và map ảnh
    const cached = localStorage.getItem(LS_PRODUCTS)
    if (cached) {
      const parsed = JSON.parse(cached)
      productState.list = Array.isArray(parsed)
        ? parsed.map(p => ({ ...p, image: resolveImage(p.image) }))
        : []
      return
    }

    // 2) Nếu chưa có thì fetch từ file JSON trong public
    const res = await fetch('/product_data/products.json')
    if (!res.ok) throw new Error(`Fetch products.json failed: ${res.status}`)
    const data = await res.json()

    productState.list = Array.isArray(data)
      ? data.map(p => ({ ...p, image: resolveImage(p.image) }))
      : []

    // Lưu lại cache (đã map ảnh)
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(productState.list))
  } catch (err) {
    console.error('Lỗi load sản phẩm:', err)
    productState.list = []
  }
}

// ===== Lưu lại vào localStorage =====
function saveProducts() {
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(productState.list))
}

// ===== Categories (lọc loại sản phẩm) =====
export const categories = computed(() => {
  const set = new Set(productState.list.map(p => p.category))
  return ['All', ...Array.from(set)]
})

// ===== Lọc + Tìm kiếm + Sắp xếp =====
export const filteredProducts = computed(() => {
  let arr = [...productState.list]

  // Tìm kiếm theo tên
  if (productState.keyword) {
    arr = arr.filter(p =>
      p.name.toLowerCase().includes(productState.keyword.toLowerCase())
    )
  }

  // Lọc theo loại
  if (productState.category !== 'All') {
    arr = arr.filter(p => p.category === productState.category)
  }

  // Sắp xếp
  switch (productState.sort) {
    case 'price_asc':
      arr.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      arr.sort((a, b) => b.price - a.price)
      break
    case 'name':
      arr.sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      arr.sort((a, b) => b.id - a.id) // mặc định: mới nhất trước
  }

  return arr
})

// ===== CRUD đơn giản =====

// Lấy sản phẩm theo id
export function getProductById(id) {
  return productState.list.find(p => String(p.id) === String(id)) || null
}

// Thêm sản phẩm
export function addProduct(data) {
  const id = productState.list.length
    ? Math.max(...productState.list.map(p => p.id)) + 1
    : 1
  const p = { id, ...data, image: resolveImage(data.image) }
  productState.list.push(p)
  saveProducts()
  return p
}

// Sửa sản phẩm
export function updateProduct(id, patch) {
  const i = productState.list.findIndex(p => p.id === id)
  if (i < 0) return null
  const next = { ...productState.list[i], ...patch }
  if (patch.image) next.image = resolveImage(patch.image)
  productState.list[i] = next
  saveProducts()
  return productState.list[i]
}

// Xóa sản phẩm
export function removeProduct(id) {
  productState.list = productState.list.filter(p => p.id !== id)
  saveProducts()
}
