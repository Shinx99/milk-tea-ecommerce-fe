
<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  product: { type: Object, required: true },
  bestSale: { type: Boolean, default: false }
})
</script>

<template>
  <div class="card text-center">

        <img :src="product.imageUrl" class="card-img-top" :alt="product.name" /> 
      <h6 class="fw-semibold">{{ product.name }}</h6>
      <div class=" text-warning fw-bold">
        {{ product.price.toLocaleString() }} đ
      </div>
  <RouterLink
      :to="`/products/${product.id}`" 
      class="btn btn-warning mx-4">
      <i class="bi bi-cart"></i> Đặt mua
    </RouterLink>

  </div>
</template>

<style scoped>
.card-img-top { object-fit: contain; height: 200px; }
</style>





