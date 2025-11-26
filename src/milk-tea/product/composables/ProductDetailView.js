import { ref, computed } from 'vue' 
import { fetchProductDetail, fetchRelateProducts } from '../service/productService'
import { getProductById } from '../composables/ProductsBase' // Lấy hàm kiểm tra cache
import { productState } from '../composables/ProductsBase.js'
import { homeState } from '../../home/store.js'

// Hàm composable dùng trong trang chi tiết sản phẩm
export function useProductDetail(productId) {
  const product = ref(getProductById(productId)) 
  const detailLoading = ref(false)
  const detailError = ref(null)

  // Related Product
  const relatedProducts = ref([])       
  const relatedLoading = ref(false)
  const relatedError = ref(null)

  async function loadDetail(idToLoad) {
    const currentId = idToLoad || productId
    if (product.value && String(product.value.id) === String(currentId)) return

    product.value = null
    detailLoading.value = true
    detailError.value = null

    try {
      const data = await fetchProductDetail(currentId)
      console.log('DETAIL API DATA:', data)
      // nếu BE trả { success, data } thì nên: product.value = data.data
      product.value = data
    } catch (err) {
      detailError.value = err.message || 'Không thể tải chi tiết sản phẩm.'
    } finally {
      detailLoading.value = false
    }
  }

  //Build related product from cache
  function buildRelatedFromCache(p) {
    const sources = []
    if (productState.list?.length) sources.push(...productState.list)
    if (homeState.bestSellers?.length) sources.push(...homeState.bestSellers)
    if (homeState.newest?.length) sources.push(...homeState.newest)

    const seen = new Set()
    return sources
      .filter(x => x.categoryId === p.categoryId && x.id !== p.id)
      .filter(x => (seen.has(x.id) ? false : (seen.add(x.id), true)))
      .slice(0, 4)
  }

  //Load related product from BE
async function loadRelated(idToLoad) {
  const currentId = idToLoad || productId
  const p = product.value
  if (!p) return

   relatedProducts.value = buildRelatedFromCache(p)

  relatedLoading.value = true
  relatedError.value = null
  try {
    const items = await fetchRelateProducts(currentId) 

    if (Array.isArray(items) && items.length) {
      relatedProducts.value = items
    } else {
      relatedProducts.value = []
    }
  } catch (err) {
    relatedError.value = err.message || 'Không thể tải sản phẩm liên quan.'
    relatedProducts.value = []
  } finally {
    relatedLoading.value = false
  }
}


  const qty = ref(1)
  const unitPrice = computed(() => product.value?.price || 0)
  const total = computed(() => unitPrice.value * qty.value)
  const dec = () => (qty.value = Math.max(1, qty.value - 1))
  const inc = () => (qty.value += 1)

  return { 
    product, qty, unitPrice, total, dec, inc,
    detailLoading, detailError, loadDetail,
    relatedProducts, relatedLoading, relatedError, loadRelated
  }
}


