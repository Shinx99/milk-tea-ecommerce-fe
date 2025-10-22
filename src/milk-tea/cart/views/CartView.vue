<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import CartItem from '../components/CartItem.vue'
import { useUserStore } from '@/milk-tea/account/store'
import { fetchCart } from '@/milk-tea/cart/api/cartService'

const userStore = useUserStore()
const router = useRouter()

const cartItems = ref([])
const isLoading = ref(false)

const customerId = userStore.userInfo?.id

const cartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
)

const isEmpty = computed(() => cartItems.value.length === 0)

const money = (n) => (Number(n) || 0).toLocaleString() + ' đ'

async function loadCart() {
  if (!customerId) return
  isLoading.value = true
  try {
    cartItems.value = await fetchCart()
  } catch (err) {
    console.error('Lỗi khi tải giỏ hàng:', err)
  } finally {
    isLoading.value = false
  }
}

function confirmOrder() {
  if (isEmpty.value) {
    alert('Giỏ hàng đang trống!')
    return
  }
  router.push('/checkout')
}

async function confirmClear() {
  if (!customerId) return
  if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
    try {
      for (const item of cartItems.value) {
        await axios.delete(`/api/cart/remove/${item.id}`)
      }
      await loadCart()
    } catch (err) {
      console.error('Lỗi khi xóa giỏ hàng:', err)
    }
  }
}

onMounted(() => {
  loadCart()
})
</script>

<template>
  <section class="container py-5">
    <h2 class="mb-4">Giỏ hàng của bạn</h2>

    <table class="table align-middle" v-if="!isEmpty">
      <thead>
        <tr>
          <th>Ảnh</th>
          <th>Sản phẩm</th>
          <th>Đơn giá</th>
          <th>Số lượng</th>
          <th>Thành tiền</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <CartItem
          v-for="item in cartItems"
          :key="item.id"
          :item="item"
          @updated="loadCart"
          @removed="loadCart"
        />
      </tbody>
    </table>

    <div v-else class="text-muted">Giỏ hàng đang trống.</div>

    <div class="text-end mt-4" v-if="!isEmpty">
      <h4>Tổng cộng: {{ cartTotal.toLocaleString() }} đ</h4>
      <button class="btn btn-success mt-2" @click="confirmOrder">
        Xác nhận đặt hàng
      </button>
      <button class="btn btn-outline-danger ms-2" @click="confirmClear">
        Xóa toàn bộ giỏ hàng
      </button>
    </div>
  </section>
</template>