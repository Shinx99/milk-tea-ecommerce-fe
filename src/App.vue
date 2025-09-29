<script setup>
import Header from './shared/components/Header.vue'
import Footer from './shared/components/Footer.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Header />

    <!-- Nội dung chính -->
    <main class="flex-grow-1 container py-4">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>
