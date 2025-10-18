<script setup>
import Banner from "@/shared/components/Banner.vue";
import { homeState, loadHomeData } from "../store.js";
import HomeBestSellerTea from "../components/HomeBestSellerTea.vue";
import HomeBestSellerMilk from "../components/HomeBestSellerMilk.vue";
// Nếu đã đổi sang Newest:
import HomeNewest from "../components/HomeNewest.vue";
import { onMounted } from "vue";
onMounted(() => { loadHomeData(); });
</script>
<template>
  <div>
    <!-- Banner tái sử dụng từ shared/components -->
    <Banner :banners="homeState.banners" />

    <!-- Các layout của Home -->
    <HomeBestSellerTea />
    <HomeBestSellerMilk />
    <HomeNewest  />
  </div>
</template>
