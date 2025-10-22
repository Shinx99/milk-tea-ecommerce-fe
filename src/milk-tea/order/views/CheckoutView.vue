<script setup>

import { submitOrder } from '../store'
import { useRouter } from 'vue-router'
import OrderSummary from '../components/OrderSummary.vue'

const router = useRouter()

async function handleCheckout() {
  try {
    const success = await submitOrder()
    if (success) {
      alert('Đặt hàng thành công!')
      clearCart()
      router.push('/orders')
    } else {
      alert('Có lỗi xảy ra khi đặt hàng.')
    }
  } catch (err) {
    console.error('Lỗi khi đặt hàng:', err)
    alert('Không thể kết nối đến máy chủ.')
  }
}
</script>

<template>
  <section class="container py-5">
    <h3>Xác nhận đơn hàng</h3>
    <OrderSummary :items="cartState.items" :total="cartTotal" />
    <button class="btn btn-success mt-4" @click="handleCheckout">
      Xác nhận đặt hàng
    </button>
  </section>
</template>