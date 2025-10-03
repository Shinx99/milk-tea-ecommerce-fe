import axios from 'axios'
import { ref } from 'vue'

export function useOrderStore() {
  const orders = ref([])
  const loaded = ref(false)
  
  async function loadOrders() {
    if (loaded.value) return
    try {
      const res = await axios.get('/admin_data/orders_manage.json')
      orders.value = res.data
      loaded.value = true
    } catch (e) {
      console.error('Load orders fail:', e)
    }
  }

  async function addOrder(orderData) {
    try {
      // await axios.post('/orders', orderData)
      const newOrder = { ...orderData, id: crypto.randomUUID() }
      orders.value.push(newOrder)
    } catch (e) {
      console.error('Add order fail:', e)
    }
  }

  async function updateOrder(orderData) {
    try {
      // await axios.put(`/orders/${orderData.id}`, orderData)
      const i = orders.value.findIndex(o => o.id === orderData.id)
      if (i !== -1) orders.value[i] = { ...orderData }
    } catch (e) {
      console.error('Update order fail:', e)
    }
  }

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
    removeOrder
  }
}
