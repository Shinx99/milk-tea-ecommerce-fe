<!-- src/milk-tea/product/views/ProductDetailView.vue -->
<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadProducts, productState, getProductById } from '../store/ProductsBase.js'
import { useProductDetail } from '../store/ProductDetailView.js'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()

// ----- Lấy sản phẩm theo id -----
const id = Number(route.params.id)
const product = ref(null)

onMounted(async () => {
  if (!productState.list.length) await loadProducts()
  product.value = getProductById(id)
  if (!product.value) router.replace('/products')
})

const { qty, size, sugar, ice, extraIce, unitPrice, total, dec, inc, addToCartNow } = useProductDetail(id)

const relatedProducts = computed(() => {
  const p = product.value
  if (!p) return []
  return productState.list
    .filter(x => x.category === p.category && x.id !== p.id)
    .slice(0, 4)
})
</script>

<template>
  <section class="container" v-if="product">
    <div class="row g-4 align-items-start">
      <!-- Ảnh -->
      <div class="col-12 col-lg-7 text-center">
        <img :src="product.image" :alt="product.name" class="img-fluid rounded shadow-sm" />
      </div>

      <!-- Form chọn option -->
      <div class="col-12 col-lg-5 px-5">
        <div class="card shadow-sm border-warning-subtle">
          <div class="card-body p-3 p-md-4">
            <h4 class="fw-bold mb-1">{{ product.name }}</h4>
            <small class="text-muted">SKU: {{ product.id }}</small>
            <h5 class="text-warning fw-bold mt-2 mb-3">{{ unitPrice.toLocaleString() }} đ</h5>

            <!-- Kích cỡ -->
            <div class="mb-3">
              <label class="fw-semibold mb-1">Chọn kích cỡ</label>
              <div class="btn-group w-100 btn-group-sm">
                <button class="btn" :class="size==='S' ? 'btn-warning':'btn-outline-warning'" @click="size='S'">
                  S <small class="d-block">0 đ</small>
                </button>
                <button class="btn" :class="size==='M' ? 'btn-warning':'btn-outline-warning'" @click="size='M'">
                  M <small class="d-block">+6000 đ</small>
                </button>
                <button class="btn" :class="size==='L' ? 'btn-warning':'btn-outline-warning'" @click="size='L'">
                  L <small class="d-block">+10000 đ</small>
                </button>
              </div>
            </div>

            <!-- Ngọt -->
            <div class="mb-3">
              <label class="fw-semibold mb-1">Ngọt</label>
              <div class="btn-group w-100 btn-group-sm">
                <button class="btn" :class="sugar==='Ít' ? 'btn-warning':'btn-outline-warning'" @click="sugar='Ít'">Ít</button>
                <button class="btn" :class="sugar==='Bình thường' ? 'btn-warning':'btn-outline-warning'" @click="sugar='Bình thường'">Bình thường</button>
                <button class="btn" :class="sugar==='Nhiều' ? 'btn-warning':'btn-outline-warning'" @click="sugar='Nhiều'">Nhiều</button>
              </div>
            </div>

            <!-- Đá -->
            <div class="mb-3">
              <label class="fw-semibold mb-1">Đá</label>
              <div class="btn-group w-100 btn-group-sm">
                <button class="btn" :class="ice==='Ít' ? 'btn-warning':'btn-outline-warning'" @click="ice='Ít'">Ít</button>
                <button class="btn" :class="ice==='Bình thường' ? 'btn-warning':'btn-outline-warning'" @click="ice='Bình thường'">Bình thường</button>
                <button class="btn" :class="ice==='Nhiều' ? 'btn-warning':'btn-outline-warning'" @click="ice='Nhiều'">Nhiều</button>
              </div>
            </div>

            <!-- Đá riêng -->
            <div class="form-check mb-3 small">
              <input id="extraIce" class="form-check-input" type="checkbox" v-model="extraIce">
              <label class="form-check-label" for="extraIce">Đá riêng (không tính phí)</label>
            </div>

            <!-- Số lượng -->
            <div class="d-flex align-items-center gap-2 mb-3">
              <button class="btn btn-outline-warning btn-sm" @click="dec">-</button>
              <span class="px-2">{{ qty }}</span>
              <button class="btn btn-outline-warning btn-sm" @click="inc">+</button>
            </div>

            <!-- Nút thêm vào giỏ -->
            <button class="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2 btn-sm py-2" @click="addToCartNow">
              <i class="bi bi-cart"></i>
              Thêm vào giỏ hàng : {{ total.toLocaleString() }} đ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sản phẩm cùng loại -->
    <div class="mt-5">
      <div class="d-flex align-items-center mb-3">
        <h5 class="mb-0">Sản phẩm cùng loại</h5>
        <span class="text-muted ms-2 small" v-if="relatedProducts.length">({{ product.category }})</span>
      </div>

      <div v-if="relatedProducts.length" class="row g-3">
        <div class="col-12 col-sm-6 col-lg-3" v-for="rp in relatedProducts" :key="rp.id">
          <ProductCard :product="rp" />
        </div>
      </div>
      <div v-else class="text-muted small">Chưa có sản phẩm cùng loại.</div>
    </div>
  </section>

  <section v-else class="container py-5 text-center text-muted">
    Đang tải sản phẩm...
  </section>
</template>
