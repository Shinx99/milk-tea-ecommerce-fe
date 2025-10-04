<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  product: { type: Object, required: true },
  bestSale: { type: Boolean, default: false }
})
</script>

<template>
  <div class="card h-100 shadow-sm position-relative">
    <span v-if="bestSale" class="badge text-dark bg-warning position-absolute top-0 start-0 m-2">
      Best sale
    </span>

    <img :src="product.image" class="card-img-top" :alt="product.name" />

    <div class="card-body text-center">
      <h6 class="fw-semibold mb-2">{{ product.name }}</h6>
      <div class="mb-3 text-warning fw-bold">
        {{ product.price.toLocaleString() }} đ
      </div>

      <RouterLink
        :to="`/products/${product.id}`"
        class="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2">
        <i class="bi bi-cart"></i> Đặt mua
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.card-img-top { object-fit: contain; height: 200px; }
</style>
