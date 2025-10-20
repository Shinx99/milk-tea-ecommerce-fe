<script setup>
import { computed, watch } from 'vue' 
import { useRoute, useRouter } from 'vue-router'
import { productState } from '../store/ProductsBase.js'
import { useProductDetail } from '../store/ProductDetailView.js'
import ProductCard from '../components/ProductCard.vue'
// LƯU Ý: Nếu biến 'sugar' không được khai báo trong composable, 
// bạn sẽ cần khai báo nó ở đây để tránh lỗi ReferenceError trong template.
// const sugar = ref('Bình thường') 

const route = useRoute()
const router = useRouter()

const id = route.params.id

const { 
  product, qty, size, sugar, ice, extraIce, // Giữ các biến logic
  unitPrice, total, dec, inc, addToCartNow, 
  detailLoading, detailError, loadDetail 
} = useProductDetail(id)

watch(
  () => route.params.id, 
  async (newId) => {
    if (newId) {
        await loadDetail(newId) 
        
        if (!product.value && !detailLoading.value && !detailError.value) {
            router.replace('/products')
        }
    }
  },
  { immediate: true } 
);

const relatedProducts = computed(() => {
  const p = product.value
  if (!p) return []
  return productState.list
    .filter(x => x.categoryId === p.categoryId && x.id !== p.id) 
    .slice(0, 4)
})
</script>

<template>
  <section v-if="detailLoading" class="container py-5 text-center text-muted">
    <div class="spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div>
    Đang tải sản phẩm...
  </section>
  <section v-else-if="detailError" class="container py-5 text-center text-danger">
    Lỗi: {{ detailError }}
  </section>
  
   <section 

    class="container" 

    v-else-if="product"

    :key="route.params.id" 

  >
   <div class="row g-4 align-items-start justify-content-center">
    <div class="col-12 col-lg-4 text-center">
        <img :src="product.imageUrl" :alt="product.name" class="img-fluid rounded shadow-sm" style="max-height: 600px; object-fit: contain;" /> 
    </div>

    <div class="col-12 col-lg-4 px-lg-3"> 
        <div class="card shadow-sm border-warning-subtle">
            <div class="card-body p-3 p-md-4">
                <h4 class="fw-bold mb-1">{{ product.name }}</h4>
                <h3 class="text-warning fw-bold mt-2 mb-3">{{ total.toLocaleString() }} đ</h3>

                <div class="mb-3">
                    <label class="fw-semibold mb-1">Size</label>
                    <div class="btn-group w-100 btn-group-sm">
                        <button class="btn" :class="size==='S' ? 'btn-warning':'btn-outline-warning'" @click="size='S'">S</button>
                        <button class="btn" :class="size==='M' ? 'btn-warning':'btn-outline-warning'" @click="size='M'">M</button>
                        <button class="btn" :class="size==='L' ? 'btn-warning':'btn-outline-warning'" @click="size='L'">L</button>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="fw-semibold mb-1">Đá</label>
                    <div class="btn-group w-100 btn-group-sm">
                        <button class="btn" :class="ice==='Ít' ? 'btn-warning':'btn-outline-warning'" @click="ice='Ít'">Ít</button>
                        <button class="btn" :class="ice==='Bình thường' ? 'btn-warning':'btn-outline-warning'" @click="ice='Bình thường'">Bình thường</button>
                        <button class="btn" :class="ice==='Nhiều' ? 'btn-warning':'btn-outline-warning'" @click="ice='Nhiều'">Nhiều</button>
                    </div>
                </div>

                <div class="form-check mb-3 small">
                    <input id="extraIce" class="form-check-input" type="checkbox" v-model="extraIce">
                    <label class="form-check-label" for="extraIce">Đá riêng (không tính phí)</label>
                </div>
                
                
                <div class="d-flex align-items-center gap-2 mb-3">
                    <button class="btn btn-outline-warning btn-sm" @click="dec">-</button>
                    <span class="px-2">{{ qty }}</span>
                    <button class="btn btn-outline-warning btn-sm" @click="inc">+</button>
                </div>

                <button class="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2 btn-sm py-2" @click="addToCartNow">
                    <i class="bi bi-cart"></i>
                    Thêm vào giỏ hàng : {{ total.toLocaleString() }} đ
                </button>
            </div>
        </div>
    </div>
</div>

    <div class="">
      <div class="d-flex align-items-center ">
        <h3 class="mb-0">Sản phẩm cùng loại</h3>
      </div>

      <div v-if="relatedProducts.length" class="row ">
        <div class="col-12 col-sm-6 col-lg-3" v-for="rp in relatedProducts" :key="rp.id">
          <ProductCard :product="rp" />
        </div>
      </div>
      <div v-else class="text-muted small">Chưa có sản phẩm cùng loại.</div>
    </div>
  </section>

  <section v-else class="container py-5 text-center text-muted">
    Không tìm thấy sản phẩm này.
  </section>
</template>