<script setup>
import { cartState, cartTotal, clearCart } from '../store'
import CartItem from '../components/CartItem.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="container py-5">
    <h3 class="mb-4">Giỏ hàng</h3>

    <div v-if="!cartState.items.length" class="alert alert-info">
      Giỏ hàng trống. <RouterLink to="/products">Tiếp tục mua sắm</RouterLink>
    </div>

    <div v-else>
      <table class="table align-middle">
        <thead>
        <tr>
          <th></th><th>Sản phẩm</th><th>Giá</th><th width="150">Số lượng</th><th>Tạm tính</th><th></th>
        </tr>
        </thead>
        <tbody>
          <CartItem v-for="i in cartState.items" :key="i.key" :item="i" />
        </tbody>
      </table>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <button class="btn btn-outline-danger" @click="clearCart()">Xóa toàn bộ</button>
        <h4>Tổng: {{ cartTotal().toLocaleString() }} đ</h4>
      </div>

      <div class="text-end mt-3">
        <RouterLink to="/checkout" class="btn btn-warning btn-lg">
          Thanh toán
        </RouterLink>
      </div>
    </div>
  </section>
</template>
