<script setup>
import { ref } from 'vue'

const activeTab = ref('product')
</script>
<template>
  <div class="container mt-3">

    <router-view />
  </div>
</template>