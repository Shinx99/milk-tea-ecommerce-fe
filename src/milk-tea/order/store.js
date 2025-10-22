import { reactive } from 'vue'
import axios from '@/api/apiClient'
import { useUserStore } from '@/milk-tea/account/store'

export const orderState = reactive({
  orders: [],
  isLoading: false,
  error: null
})

export async function submitOrder() {
  const userStore = useUserStore()
  const customerId = userStore.userInfo?.id
  if (!customerId) {
    alert('Bạn cần đăng nhập để đặt hàng.')
    return false
  }

  const payload = getOrderPayload()

  try {
    await axios.post(`/api/orders/${customerId}`, payload)
    return true
  } catch (err) {
    console.error('Lỗi khi gửi đơn hàng:', err)
    return false
  }
}

export async function loadOrders() {
  const userStore = useUserStore()
  const customerId = userStore.userInfo?.id
  if (!customerId) return

  orderState.isLoading = true
  try {
    const res = await axios.get(`/api/orders/${customerId}`)
    orderState.orders = res.data
    orderState.error = null
  } catch (err) {
    orderState.error = err.message
    console.error('Lỗi khi tải đơn hàng:', err)
  } finally {
    orderState.isLoading = false
  }
}