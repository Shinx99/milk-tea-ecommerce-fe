<script setup>
import { categories, productState } from '@/milk-tea/product/store'
const setCat = (c) => productState.category = c
</script>

<template>
  <div class="d-flex flex-wrap gap-2">
    <button
      v-for="c in categories" :key="c"
      class="btn"
      :class="c===productState.category ? 'btn-dark' : 'btn-outline-dark'"
      @click="setCat(c)"
    >{{ c }}</button>
  </div>
</template>
