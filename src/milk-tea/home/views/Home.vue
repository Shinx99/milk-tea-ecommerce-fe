<script setup>
import Banner from '@/shared/components/Banner.vue'
import bannerImg from '@/assets/images/banner1.png'   // bạn để ảnh ở assets/images
</script>

<template>
  <div>
    <!-- Banner -->
    <Banner
      :image="bannerImg"
      title="Milk Tea E-Commerce"
      subtitle="Thưởng thức trà sữa thơm ngon, giao hàng tận nơi"
    />

    <!-- Nội dung Home -->
    <section class="container">
      <h2 class="fw-bold text-center mb-4">Sản phẩm nổi bật</h2>
      <!-- chèn ProductList hoặc gì đó ở đây -->
    </section>
  </div>
</template>
