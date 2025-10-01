<!-- src/milk-tea/home/views/Home.vue -->
<script setup>
import Banner from '@/shared/components/Banner.vue'
</script>

<template>
  <!-- Banner phải đứng riêng, KHÔNG bọc trong .container -->
  <Banner />

  <!-- Nội dung dưới banner mới dùng container -->
  <section class="container">
    <!-- phần nội dung khác -->
  </section>
</template>
