import { computed } from 'vue'                        // import API computed của Vue (biến tính toán)
import { productState } from '../store/ProductsBase'      // import state gốc (danh sách sản phẩm, keyword, sort...)

export const listState = productState                 // alias: dùng lại state gốc để dễ gọi trong file này

// ==== Danh sách categories (danh mục) ====
export const categories = computed(() => {            // computed: tự cập nhật khi listState.list thay đổi
  const set = new Set(listState.list.map(p => p.category)) // lấy tất cả category từ danh sách sản phẩm
  return ['All', ...Array.from(set)]                  // thêm 'All' (tất cả) vào đầu, rồi chuyển set thành mảng
})

// ==== Danh sách sản phẩm sau khi lọc & sắp xếp ====
export const filteredProducts = computed(() => {      // computed: danh sách sản phẩm đã qua filter/sort
  let arr = [...listState.list]                       // clone mảng gốc để xử lý (tránh ảnh hưởng trực tiếp)

  // --- Lọc theo keyword ---
  if (listState.keyword) {                            // nếu có từ khóa tìm kiếm
    const kw = listState.keyword.toLowerCase()        // đổi keyword về chữ thường
    arr = arr.filter(p =>                             // lọc các sản phẩm thỏa:
      p.name.toLowerCase().includes(kw) ||            // tên có chứa keyword
      (p.desc || '').toLowerCase().includes(kw)       // hoặc mô tả có chứa keyword (nếu desc null thì dùng rỗng)
    )
  }

  // --- Lọc theo category ---
  if (listState.category !== 'All') {                 // nếu không chọn "All"
    arr = arr.filter(p => p.category === listState.category) // chỉ giữ sản phẩm cùng category
  }

  // --- Sắp xếp ---
  switch (listState.sort) {                           // kiểm tra lựa chọn sort
    case 'price_asc':                                 // sắp xếp giá tăng dần
      arr.sort((a,b)=>a.price-b.price); break
    case 'price_desc':                                // sắp xếp giá giảm dần
      arr.sort((a,b)=>b.price-a.price); break
    case 'name':                                      // sắp xếp theo tên (A → Z)
      arr.sort((a,b)=>a.name.localeCompare(b.name)); break
    default:                                          // mặc định: sắp xếp theo id giảm dần (mới trước, cũ sau)
      arr.sort((a,b)=>b.id-a.id)
  }

  return arr                                          // trả về mảng cuối cùng sau khi lọc + sắp xếp
})
