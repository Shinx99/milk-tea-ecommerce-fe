<script setup>
</script>

<template>
  <div id="mainCarousel" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="@/assets/images/banner1.png" class="d-block w-100" alt="banner1">
      </div>
      <div class="carousel-item">
        <img src="@/assets/images/banner2.png" class="d-block w-100" alt="banner2">
      </div>
      <div class="carousel-item">
        <img src="@/assets/images/banner3.png" class="d-block w-100" alt="banner3">
      </div>
    </div>

    <!-- Nút điều hướng -->
    <button class="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>

    <!-- Dấu chấm chỉ số -->
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="0" class="active" aria-current="true"></button>
      <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="1"></button>
      <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="2"></button>
    </div>
  </div>
</template>

<style scoped>

</style>
