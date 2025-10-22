<template>
  <div>
    <div v-for="item in items" :key="item.productId" class="border-bottom py-2">
      <div><strong>{{ item.productName }}</strong></div>
      <div>Số lượng: {{ item.quantity }} | Giá: {{ item.price.toLocaleString() }} đ</div>
      <div>Tổng: {{ item.lineTotal.toLocaleString() }} đ</div>
    </div>
    <div class="text-end mt-3">
      <strong>Tổng cộng: {{ total.toLocaleString() }} đ</strong>
    </div>
  </div>
</template>

<script setup>
defineProps({ items: Array, total: Number })
</script>