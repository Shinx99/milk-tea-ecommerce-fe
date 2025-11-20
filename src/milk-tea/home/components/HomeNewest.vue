<script setup>
import { homeState } from "../store.js";
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="container my-5">
    <h3 class="text-center fw-bold mb-4 text-success">SẢN PHẨM MỚI NHẤT</h3>

    <div class="row g-4">
      <div class="col-md-3" v-for="item in homeState.newest" :key="item.id">
        <div class="card product-card text-center h-100">
          <!-- Ảnh sản phẩm hoặc fallback -->
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.name"
            class="product-img"
          />
          <div
            v-else
            class="product-img d-flex align-items-center justify-content-center text-muted"
          >
            [Ảnh bị thiếu]
          </div>

          <div class="card-body">
            <h6 class="fw-semibold">{{ item.name }}</h6>
            <p class="text-success fw-bold">
              {{ item.price.toLocaleString() }} ₫
            </p>
            <RouterLink
              class="btn btn-warning w-100 btn-buy"
              :to="`/products/${item.id}`"
            >
              <i class="bi bi-cart me-2"></i> Đặt mua
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* dùng chung CSS như BestSeller */
.product-card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  padding: 0.5rem;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.product-img {
  width: 100%;
  height: 200px; /* giống card sản phẩm */
  object-fit: contain; /* KHÔNG méo */
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}
@media (min-width: 768px) {
  .product-img {
    height: 220px;
  }
}
@media (min-width: 1200px) {
  .product-img {
    height: 260px;
  }
}

.btn-buy {
  border-radius: 8px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.btn-buy:hover {
  background-color: #ffca2c;
  transform: scale(1.03);
}
</style>
