<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { seedProducts } from '../data/products'
import { addToCart } from '@/milk-tea/cart/store'

const route = useRoute()
const router = useRouter()

// lấy sản phẩm theo id
const id = Number(route.params.id)
const product = seedProducts.find(p => p.id === id)
if (!product) router.replace('/products')

// state
const qty   = ref(1)
const size  = ref('S')                     // S gốc, M +6000, L +10000
const sugar = ref('Bình thường')
const tea   = ref('Bình thường')
const ice   = ref('Bình thường')
const extraIce = ref(false)                // đá riêng (không tính phí)

// tính giá
const sizeDelta = computed(() =>
  size.value === 'M' ? 6000 : size.value === 'L' ? 10000 : 0
)
const unitPrice = computed(() => product.price + sizeDelta.value)
const total     = computed(() => unitPrice.value * qty.value)

const dec = () => (qty.value = Math.max(1, qty.value - 1))
const inc = () => (qty.value += 1)

// thêm vào giỏ hàng rồi QUAY LẠI TRANG CŨ
function addToCartNow() {
  addToCart(product, {
    qty: qty.value,
    unitPrice: unitPrice.value,
    options: { size: size.value, sugar: sugar.value, tea: tea.value, ice: ice.value, extraIce: extraIce.value }
  })
  // quay lại trang trước (sản phẩm / danh sách…)
  router.back()
}
</script>

<template>
  <section class="container py-4">
    <div class="row g-4 align-items-start">
      <!-- ảnh: rộng hơn một chút -->
      <div class="col-12 col-lg-7 text-center">
        <img :src="product.image" :alt="product.name" class="img-fluid rounded shadow-sm" />
      </div>

      <!-- form: NHỎ GỌN trong card, dùng size-sm của Bootstrap -->
      <div class="col-12 col-lg-5">
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

            <!-- Trà -->
            <div class="mb-3">
              <label class="fw-semibold mb-1">Trà</label>
              <div class="btn-group w-100 btn-group-sm">
                <button class="btn" :class="tea==='Ít' ? 'btn-warning':'btn-outline-warning'" @click="tea='Ít'">Ít</button>
                <button class="btn" :class="tea==='Bình thường' ? 'btn-warning':'btn-outline-warning'" @click="tea='Bình thường'">Bình thường</button>
                <button class="btn" :class="tea==='Nhiều' ? 'btn-warning':'btn-outline-warning'" @click="tea='Nhiều'">Nhiều</button>
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
              <label for="extraIce" class="form-check-label">Đá riêng (không tính phí)</label>
            </div>

            <!-- Số lượng -->
            <div class="d-flex align-items-center gap-2 mb-3">
              <button class="btn btn-outline-warning btn-sm" @click="dec">-</button>
              <span class="px-2">{{ qty }}</span>
              <button class="btn btn-outline-warning btn-sm" @click="inc">+</button>
            </div>

            <!-- Nút thêm vào giỏ -> quay lại trang trước -->
            <button
              class="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2 btn-sm py-2"
              @click="addToCartNow"
            >
              <i class="bi bi-cart"></i>
              Thêm vào giỏ hàng : {{ total.toLocaleString() }} đ
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
