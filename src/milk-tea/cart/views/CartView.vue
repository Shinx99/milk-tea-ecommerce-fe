<!-- src/milk-tea/cart/views/CartView.vue -->
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import CartItem from '../components/CartItem.vue'

// LƯU Ý: đường dẫn dưới đây phải đúng nơi bạn export store giỏ hàng
// Nếu store ở "src/milk-tea/cart/store.js" và file này nằm trong "views/",
// thì import như sau:
import { cartState, cartTotal, clearCart } from '../store'

// Helper format tiền
const money = (n) => (Number(n) || 0).toLocaleString() + ' đ'

// Giỏ trống?
const isEmpty = computed(() => cartState.items.length === 0)
</script>

<template>
  <section class="container py-5">
    <h3 class="mb-4">Giỏ hàng</h3>

    <!-- Giỏ trống -->
    <div v-if="isEmpty" class="alert alert-info">
      Giỏ hàng trống. <RouterLink to="/products">Tiếp tục mua sắm</RouterLink>
    </div>

    <!-- Có hàng -->
    <div v-else>
      <table class="table align-middle">
        <thead>
          <tr>
            <th style="width:72px;"></th>
            <th>Sản phẩm</th>
            <th style="width:140px;">Giá</th>
            <th style="width:150px;">Số lượng</th>
            <th style="width:160px;">Tạm tính</th>
            <th style="width:80px;"></th>
          </tr>
        </thead>
        <tbody>
          <CartItem
            v-for="i in cartState.items"
            :key="i.key"
            :item="i"
          />
        </tbody>
      </table>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <button class="btn btn-outline-danger" @click="clearCart()">
          Xóa toàn bộ
        </button>

        <!-- cartTotal là computed -> KHÔNG dùng cartTotal() -->
        <h4 class="mb-0">Tổng: {{ money(cartTotal) }}</h4>
      </div>

      <div class="text-end mt-3">
        <RouterLink to="/checkout" class="btn btn-warning btn-lg">
          Thanh toán
        </RouterLink>
      </div>
    </div>
  </section>
</template>
