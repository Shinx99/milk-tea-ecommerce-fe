<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  product: { type: Object, required: true },
  bestSale: { type: Boolean, default: false }
})
</script>

<template>
  <div class="card h-100 shadow-sm position-relative">

    <img src="https://via.placeholder.com/300x200?text=Trà+Sữa" class="card-img-top" :alt="product.name" /> 

    <div class="card-body text-center">
      <h6 class="fw-semibold mb-2">{{ product.name }}</h6>
      <div class="mb-3 text-warning fw-bold">
        {{ product.price.toLocaleString() }} đ
      </div>

      <div class="card-body text-center">
    <RouterLink
      :to="`/products/${product.id}`" 
      class="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2"
    >
      <i class="bi bi-cart"></i> Đặt mua
    </RouterLink>
    
  </div>
      </div>
  </div>
</template>

<style scoped>
.card-img-top { object-fit: contain; height: 200px; }
</style>