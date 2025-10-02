<script setup>
import { ref } from 'vue'

const activeTab = ref('product')
</script>
<template>
  <div class="container mt-3">
    <nav class="mb-4">
      <router-link to="/admin/category" class="btn btn-outline-primary me-2">Categories</router-link>
      <router-link to="/admin/order" class="btn btn-outline-primary me-2">Order</router-link>
      <router-link to="/admin/product" class="btn btn-primary">Product</router-link>
    </nav>

    <router-view />
  </div>
</template>