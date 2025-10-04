<script setup>
import { filteredProducts } from '../store/ProductListView.js'
import ProductCard from './ProductCard.vue'
</script>

<template>
  <div class="row g-3">
    <div v-for="p in filteredProducts" :key="p.id" class="col-12 col-sm-6 col-lg-4 col-xl-3">
      <ProductCard :product="p" />
    </div>
  </div>
</template>
