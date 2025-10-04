import { reactive } from "vue"; // import reactive: tạo state reactive trong Vue

const LS_PRODUCTS = "mt_products"; // key lưu danh sách sản phẩm trong localStorage

// ==== State gốc dùng chung cho toàn bộ sản phẩm ====
export const productState = reactive({
  // dùng reactive để tạo state toàn cục
  list: [], // danh sách sản phẩm (mảng)
  keyword: "", // từ khoá tìm kiếm
  category: "All", // category đang chọn (mặc định "All")
  sort: "popular", // kiểu sắp xếp (popular, price_asc, ...)
});

// ==== Hàm xử lý ảnh (mapping image src) ====
// src/milk-tea/product/store/productsBase.js
function resolveImage(src) {
  if (!src) return "https://via.placeholder.com/300x200?text=No+Image";
  const s = String(src).trim();

  // Nếu là URL tuyệt đối thì giữ nguyên
  if (/^https?:\/\//i.test(s)) return s;

  // Chỉ lấy tên file ảnh cuối cùng (bỏ ../assets hoặc /assets nếu có)
  const filename = s.split("/").pop();

  // Trỏ trực tiếp vào src/assets/images
  return new URL(`/src/assets/images/${filename}`, import.meta.url).href;
}

// ==== Hàm load sản phẩm ====
export async function loadProducts() {
  try {
    // --- Ưu tiên lấy từ localStorage ---
    const cached = localStorage.getItem(LS_PRODUCTS); // lấy dữ liệu cache
    if (cached) {
      // nếu đã có
      const parsed = JSON.parse(cached); // parse JSON
      productState.list = Array.isArray(parsed) // kiểm tra có phải mảng không
        ? parsed.map((p) => ({ ...p, image: resolveImage(p.image) })) // gắn lại đường dẫn ảnh
        : [];
      return; // thoát luôn (không cần fetch JSON)
    }

    // --- Nếu chưa có thì fetch từ public/product_data/products.json ---
    const res = await fetch("/product_data/products.json"); // gọi API fetch file JSON
    if (!res.ok) throw new Error(`Fetch products.json failed: ${res.status}`);
    const data = await res.json(); // parse dữ liệu JSON thành object

    productState.list = Array.isArray(data) // gán list vào state
      ? data.map((p) => ({ ...p, image: resolveImage(p.image) }))
      : [];

    // --- Lưu vào localStorage để cache ---
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(productState.list));
  } catch (err) {
    console.error("Lỗi load sản phẩm:", err); // log nếu có lỗi
    productState.list = []; // gán list rỗng để tránh crash
  }
}

// ==== Hàm tìm sản phẩm theo ID ====
export function getProductById(id) {
  return productState.list.find((p) => String(p.id) === String(id)) || null;
  // so sánh id dưới dạng chuỗi để tránh lệch kiểu (số vs chuỗi)
}
