<script setup>
import { homeState } from "../store.js";
import { RouterLink } from "vue-router";
import ProductCard from '../../product/components/ProductCard.vue'
</script>

<template>
  <section class="container my-5">
    <h3 class="text-center fw-bold mb-4 text-success">SẢN PHẨM MỚI NHẤT</h3>

    <div class="row g-4">
      <div class="col-md-3" v-for="item in homeState.newest" :key="item.id">

        <ProductCard :product="item" /> 

      </div>
    </div>
  </section>
</template>
