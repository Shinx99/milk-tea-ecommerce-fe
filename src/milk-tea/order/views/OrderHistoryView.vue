<script setup>
import { onMounted } from 'vue'
import { orderState, loadOrders } from '../store'
import OrderSummary from '../components/OrderSummary.vue'

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <section class="container py-5">
    <h3>Lịch sử đơn hàng</h3>

    <div v-if="orderState.isLoading">Đang tải...</div>
    <div v-else-if="orderState.orders.length === 0">
      Bạn chưa có đơn hàng nào
    </div>
    <div v-else>
      <div
        v-for="order in orderState.orders"
        :key="order.orderId"
        class="border rounded p-3 mb-3"
      >
        <div class="mb-2">
          <strong>Đơn hàng #{{ order.orderId }}</strong><br />
          Ngày đặt: {{ new Date(order.placedAt).toLocaleDateString('vi-VN') }}<br />
          Trạng thái:
          <span :class="{
            'text-warning': order.status === 'PENDING',
            'text-success': order.status === 'CONFIRMED',
            'text-danger': order.status === 'CANCELLED'
          }">
            {{ order.status }}
          </span>
        </div>
        <OrderSummary :items="order.items" :total="order.total" />
      </div>
    </div>
  </section>
</template>