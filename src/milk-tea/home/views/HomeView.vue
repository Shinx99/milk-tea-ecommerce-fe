<script setup>
import Banner from "@/shared/components/Banner.vue";
import { homeState } from "../store.js";

// Import các section con
import HomeCollection from "../components/HomeCollection.vue";
import HomeBestSellerTea from "../components/HomeBestSellerTea.vue";
import HomeBestSellerMilk from "../components/HomeBestSellerMilk.vue";
import HomePromotion from "../components/HomePromotion.vue";
</script>

<template>
  <div>
    <!-- Banner tái sử dụng từ shared/components -->
    <Banner :banners="homeState.banners" />

    <!-- Các layout của Home -->
    <HomeCollection />
    <HomeBestSellerTea />
    <HomeBestSellerMilk />
    <HomePromotion />
  </div>
</template>
