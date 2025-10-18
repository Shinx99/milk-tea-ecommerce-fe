<script setup>
import { homeState } from "../store.js";
</script>

<template>
  <section class="container my-5">
    <h3 class="text-center fw-bold mb-4">BEST SELLERS - TRÀ THƠM CHẤT LƯỢNG</h3>
    <div class="row g-4">
      <div
        class="col-md-3"
        v-for="item in homeState.bestSellerFruitTea"
        :key="item.id"
      >
        <div class="card h-100 shadow-sm text-center">
          <img :src="item.image" :alt="item.name" class="card-img-top p-3" />
          <div class="card-body">
            <h6 class="fw-semibold">{{ item.name }}</h6>
            <p class="text-success">{{ item.price.toLocaleString() }} ₫</p>
            <RouterLink
  class="btn btn-success btn-sm w-100"
  :to="`/products/${item.id}`"
>
  <i class="bi bi-cart me-2"></i>
  Đặt mua
</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
