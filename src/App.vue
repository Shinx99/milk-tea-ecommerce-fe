<script setup>
import Header from "./shared/components/Header.vue";
import Footer from "./shared/components/Footer.vue";
import ChatBox from "./shared/components/ChatBox.vue";
import { onMounted, computed } from "vue";
import { setupCart, watchCartUser } from "./milk-tea/cart/store";
import { useRoute } from "vue-router"; // QUAN TRỌNG: Import useRoute

const route = useRoute(); // Sử dụng hook useRoute

// Logic kiểm tra xem có phải là trang Admin hay không
// Mọi route có meta.layout = 'admin' sẽ bị ẩn Header/Footer chung.
const isPublicLayout = computed(() => route.meta?.layout !== "admin");

onMounted(() => {
  // Logic khởi tạo app
  setupCart();
  watchCartUser();
});
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Header v-if="isPublicLayout" />

    <main :class="['flex-grow-1', { 'container py-4': isPublicLayout }]">
      <RouterView />
      <ChatBox v-if="isPublicLayout" />
    </main>

    <Footer v-if="isPublicLayout" />
  </div>
</template>
