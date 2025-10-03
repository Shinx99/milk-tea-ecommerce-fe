import { reactive } from 'vue'                           // import reactive: tạo state reactive trong Vue

const LS_PRODUCTS = 'mt_products'                        // key lưu danh sách sản phẩm trong localStorage

// ==== State gốc dùng chung cho toàn bộ sản phẩm ====
export const productState = reactive({                   // dùng reactive để tạo state toàn cục
  list: [],                                               // danh sách sản phẩm (mảng)
  keyword: '',                                            // từ khoá tìm kiếm
  category: 'All',                                        // category đang chọn (mặc định "All")
  sort: 'popular',                                        // kiểu sắp xếp (popular, price_asc, ...)
})

// ==== Hàm xử lý ảnh (mapping image src) ====
function resolveImage(src) {
  if (!src) return src                                   // nếu không có src → return null
  if (src.includes('://')) return src                    // nếu là URL tuyệt đối (http://...) → giữ nguyên
  const filename = String(src).split('/').pop()          // lấy tên file cuối cùng từ đường dẫn
  return new URL(`../../assets/images/${filename}`, import.meta.url).href
  // chuyển thành URL tuyệt đối tới thư mục assets/images (giúp Vite build đúng)
}

// ==== Hàm load sản phẩm ====
export async function loadProducts() {
  try {
    // --- Ưu tiên lấy từ localStorage ---
    const cached = localStorage.getItem(LS_PRODUCTS)     // lấy dữ liệu cache
    if (cached) {                                        // nếu đã có
      const parsed = JSON.parse(cached)                  // parse JSON
      productState.list = Array.isArray(parsed)          // kiểm tra có phải mảng không
        ? parsed.map(p => ({ ...p, image: resolveImage(p.image) })) // gắn lại đường dẫn ảnh
        : []
      return                                              // thoát luôn (không cần fetch JSON)
    }

    // --- Nếu chưa có thì fetch từ public/product_data/products.json ---
    const res = await fetch('/product_data/products.json') // gọi API fetch file JSON
    if (!res.ok) throw new Error(`Fetch products.json failed: ${res.status}`)
    const data = await res.json()                        // parse dữ liệu JSON thành object

    productState.list = Array.isArray(data)              // gán list vào state
      ? data.map(p => ({ ...p, image: resolveImage(p.image) }))
      : []

    // --- Lưu vào localStorage để cache ---
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(productState.list))
  } catch (err) {
    console.error('Lỗi load sản phẩm:', err)             // log nếu có lỗi
    productState.list = []                               // gán list rỗng để tránh crash
  }
}

// ==== Hàm tìm sản phẩm theo ID ====
export function getProductById(id) {
  return productState.list.find(p => String(p.id) === String(id)) || null
  // so sánh id dưới dạng chuỗi để tránh lệch kiểu (số vs chuỗi)
}
