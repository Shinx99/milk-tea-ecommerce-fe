<script setup>
import { onMounted } from 'vue'
import { loadProducts, productState } from '../store/ProductsBase.js'
import { categories } from '../store/ProductListView.js'
import ProductList from '../components/ProductList.vue'

onMounted(async () => {
  await loadProducts() // Lần đầu tải (sẽ được watcher trong ProductListView.js gọi)
})
</script>

<template>
  <div class="container py-4">
    <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
      <h3 class="me-auto mb-0">Sản phẩm</h3>

      <input v-model="productState.keyword" type="search" class="form-control" style="max-width:260px" placeholder="Tìm theo tên..." />
      
      <select v-model="productState.category" class="form-select" style="max-width:160px">
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>


    </div>

    <div v-if="productState.isLoading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div>
        <p class="mt-2">Đang tải danh sách sản phẩm...</p>
    </div>
    <div v-else-if="productState.error" class="alert alert-danger text-center">
        Lỗi: {{ productState.error }}
        <button class="btn btn-sm btn-danger ms-3" @click="loadProducts">Thử tải lại</button>
    </div>
    
    <ProductList v-else />
  </div>
</template>