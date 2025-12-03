<!-- src/milk-tea/cart/views/CartView.vue -->
<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import CartItem from '../components/CartItem.vue'
import {
  cartState,
  cartTotal,
  fetchCartFromServer,
  //setupCart,
} from '../store'
import { useUserStore } from '@/milk-tea/account/store'

const money = (n) => (Number(n) || 0).toLocaleString() + ' đ'

const userStore = useUserStore()

const isLoggedIn = computed(
  () => !!userStore.userInfo?.userId && !!localStorage.getItem('token')
)
// items hiển thị: nếu đã login -> activeItems từ server, nếu guest -> guestItems local
const items = computed(() =>
  isLoggedIn.value ? cartState.activeItems : cartState.guestItems
)

const isEmpty = computed(() => !items.value || items.value.length === 0)

onMounted(async () => {
  console.log('isLoggedIn', isLoggedIn.value, userStore.userInfo, localStorage.getItem('token'))
  if (isLoggedIn.value) {
    await fetchCartFromServer()
  }
})

function handleClear() {
  if (isLoggedIn.value) {
    // clear trên server
    import('../store').then(({ clearCartServer }) => clearCartServer())
  } else {
    import('../store').then(({ clearCartGuest }) => clearCartGuest())
  }
}
</script>

<template>
  <section class="container py-5">
    <h3 class="mb-4">Giỏ hàng</h3>

    <div v-if="cartState.loading" class="alert alert-info">
      Đang tải giỏ hàng...
    </div>

    <div v-else-if="isEmpty" class="alert alert-info">
      Giỏ hàng trống. <RouterLink to="/products">Tiếp tục mua sắm</RouterLink>
    </div>

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
            v-for="i in items"
            :key="i.id || i.key"
            :item="i"
            :logged-in="isLoggedIn"
          />
        </tbody>
      </table>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <button class="btn btn-outline-danger" @click="handleClear">
          Xóa toàn bộ
        </button>

        <h4 class="mb-0">Tổng: {{ money(cartTotal) }}</h4>
      </div>

      <div class="text-end mt-3">
        <RouterLink to="/checkout" class="btn btn-warning btn-lg">
          Mua hàng
        </RouterLink>
      </div>
    </div>
  </section>
</template>
