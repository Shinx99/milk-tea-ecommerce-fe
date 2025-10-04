import axios from 'axios'
import { ref } from 'vue'

// Đường dẫn file json (có thể đổi sang API khi backend thật)
const ORDERS_URL = '/admin_data/orders_manage.json'
const ORDER_DETAIL_URL = '/admin_data/order_detail.json' // file chi tiết đơn hàng

export function useOrderStore() {
  const orders = ref([])
  const loaded = ref(false)
  const orderItems = ref([]) // lưu các dòng sản phẩm chi tiết đơn

  // Load danh sách hóa đơn
  async function loadOrders() {
    if (loaded.value) return
    try {
      const res = await axios.get(ORDERS_URL)
      orders.value = res.data
      loaded.value = true
    } catch (e) {
      console.error('Load orders fail:', e)
    }
  }

  // Load chi tiết sản phẩm của hóa đơn (truyền orderId)
  async function loadOrderItems(orderId) {
    try {
      const res = await axios.get(ORDER_DETAIL_URL)
      orderItems.value = res.data.filter(item => item.order_id === orderId)
    } catch (e) {
      console.error('Load order items fail:', e)
    }
  }

  // Thêm mới hóa đơn (mock), để gọi API thật thì bỏ comment
  async function addOrder(orderData) {
    try {
      // await axios.post('/orders', orderData)
      const newOrder = { ...orderData, id: crypto.randomUUID() }
      orders.value.push(newOrder)
    } catch (e) {
      console.error('Add order fail:', e)
    }
  }

  // Cập nhật hóa đơn (mock)
  async function updateOrder(orderData) {
    try {
      // await axios.put(`/orders/${orderData.id}`, orderData)
      const i = orders.value.findIndex(o => o.id === orderData.id)
      if (i !== -1) orders.value[i] = { ...orderData }
    } catch (e) {
      console.error('Update order fail:', e)
    }
  }

  // Xóa hóa đơn (mock)
  async function removeOrder(id) {
    try {
      // await axios.delete(`/orders/${id}`)
      const i = orders.value.findIndex(o => o.id === id)
      if (i !== -1) orders.value.splice(i, 1)
    } catch (e) {
      console.error('Remove order fail:', e)
    }
  }

  return {
    orders,
    loaded,
    loadOrders,
    addOrder,
    updateOrder,
    removeOrder,
    orderItems,
    loadOrderItems
  }
}
