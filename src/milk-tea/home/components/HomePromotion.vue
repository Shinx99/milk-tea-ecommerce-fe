<script setup>
import { homeState } from "../store.js";
</script>

<template>
  <section class="container my-5">
    <h3 class="text-center fw-bold mb-3">Tin tức & Khuyến mãi</h3>
    <p class="text-center text-muted small mb-4">
      Tin tức & Khuyến mãi mới nhất của Milk Tea
    </p>
    <div class="row g-4">
      <div
        class="col-md-3"
        v-for="promo in homeState.promotions"
        :key="promo.id"
      >
        <div class="card h-100 shadow-sm">
          <img :src="promo.image" :alt="promo.title" class="card-img-top" />
          <div class="card-body">
            <h6 class="fw-semibold">{{ promo.title }}</h6>
            <p class="small text-muted">
              <i class="bi bi-eye"></i> {{ promo.views }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center mt-3">
      <RouterLink to="/news" class="btn btn-outline-success btn-sm"
        >Xem thêm</RouterLink
      >
    </div>
  </section>
</template>
