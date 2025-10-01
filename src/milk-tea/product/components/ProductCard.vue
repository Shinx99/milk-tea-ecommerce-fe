<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  product:  { type: Object, required: true },
  bestSale: { type: Boolean, default: false }
})
</script>

<template>
  <div class="card h-100 shadow-sm position-relative">
    <!-- Nhãn Best sale (nếu có) -->
    <span
      v-if="bestSale"
      class="badge text-dark bg-warning position-absolute top-0 start-0 m-2"
      style="z-index: 2;"
    >
      Best sale
    </span>

    <!-- Ảnh -->
    <img :src="product.image" class="card-img-top" :alt="product.name" />

    <!-- Nội dung -->
    <div class="card-body text-center">
      <h6 class="fw-semibold mb-2">{{ product.name }}</h6>
      <div class="mb-3 text-warning fw-bold">
        {{ product.price.toLocaleString() }} đ
      </div>

      <!-- Đặt mua: chuyển sang trang chi tiết để chọn size/đường/đá -->
      <RouterLink
        :to="`/products/${product.id}`"
        class="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2"
      >
        <i class="bi bi-cart"></i> Đặt mua
      </RouterLink>

      <!-- (tuỳ chọn) nút xem chi tiết riêng -->
      <!--
      <RouterLink :to="`/products/${product.id}`" class="btn btn-outline-warning w-100 mt-2">
        Xem chi tiết
      </RouterLink>
      -->
    </div>
  </div>
</template>

<style scoped>
.card-img-top { object-fit: contain; height: 200px; }
</style>
