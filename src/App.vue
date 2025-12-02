<script setup>
import Header from './shared/components/Header.vue'
import Footer from './shared/components/Footer.vue'
import ChatBox from './shared/components/ChatBox.vue'
import { onMounted } from 'vue';
import { setupCart, watchCartUser } from './milk-tea/cart/store';

onMounted(() => {
  setupCart();
  watchCartUser();
});

</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Header />

    <!-- Nội dung chính -->
    <main class="flex-grow-1 container py-4">
      <RouterView />
      <ChatBox />
    </main>

    <Footer />
  </div>
</template>
