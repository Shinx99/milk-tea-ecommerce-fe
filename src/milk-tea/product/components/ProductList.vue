<script setup>
import { filteredProducts } from "@/milk-tea/product/store"
import ProductCard from "./ProductCard.vue"
</script>

<template>
  <div class="row g-3">
    <div
      class="col-12 col-sm-6 col-lg-4 col-xl-3"
      v-for="p in filteredProducts"
      :key="p.id"
    >
      <ProductCard :product="p" />
    </div>
  </div>
</template>
