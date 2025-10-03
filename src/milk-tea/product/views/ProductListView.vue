<script setup>
import { productState, categories, loadProducts } from "@/milk-tea/product/store"
import ProductList from "@/milk-tea/product/components/ProductList.vue"

// load sản phẩm khi mở trang
loadProducts()
</script>

<template>
  <div class="container py-4">
    <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
      <h3 class="me-auto mb-0">Sản phẩm</h3>

      <input
        v-model="productState.keyword"
        type="search"
        class="form-control"
        style="max-width:260px"
        placeholder="Tìm theo tên..."
      />

      <select v-model="productState.category" class="form-select" style="max-width:160px">
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>

      <select v-model="productState.sort" class="form-select" style="max-width:180px">
        <option value="popular">Phổ biến</option>
        <option value="price_asc">Giá tăng dần</option>
        <option value="price_desc">Giá giảm dần</option>
        <option value="name">Tên (A→Z)</option>
      </select>

      <div class="d-flex gap-2">
        <input v-model.number="productState.priceMin" type="number" class="form-control" style="width:120px" placeholder="Giá từ" />
        <input v-model.number="productState.priceMax" type="number" class="form-control" style="width:120px" placeholder="Đến" />
      </div>
    </div>

    <ProductList />
  </div>
</template>
