<script setup>
import Banner from "@/shared/components/Banner.vue";
import { homeState, loadHomeData } from "../store.js";
import HomeBestSeller from "../components/HomeBestSeller.vue";
// Nếu đã đổi sang Newest:
import HomeNewest from "../components/HomeNewest.vue";
import { onMounted } from "vue";
onMounted(() => {
  loadHomeData();
});
</script>
<template>
  <div>
    <!-- Banner tái sử dụng từ shared/components -->
    <Banner :banners="homeState.banners" />

    <!-- Các layout của Home -->
    <HomeBestSeller />
    <HomeNewest />
  </div>
</template>
