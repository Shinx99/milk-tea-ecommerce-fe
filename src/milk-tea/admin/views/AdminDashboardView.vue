<script setup>
import adminProduct from '../components/AdminProductManage.vue'
import AdminOrder from '../components/AdminOrderManage.vue';
</script>

<template>
  <div class="container mt-3">
    <nav class="mb-4">
      <a href="#" class="btn btn-outline-primary me-2">Categories</a>
      <a href="#" class="btn btn-outline-primary me-2">Order</a>
      <a href="#" class="btn btn-primary">Product</a>
    </nav>

    <adminProduct />

    <hr>

    <AdminOrder/>

    
  </div>
</template>
