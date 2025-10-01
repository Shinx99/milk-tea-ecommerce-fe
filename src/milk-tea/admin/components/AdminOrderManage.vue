<template>
  <div class="container">
    <nav class="mb-4">
      <button class="btn btn-outline-primary me-2" @click="switchTab('list')">Order List</button>
      <button class="btn btn-outline-primary" @click="switchTab('detail')">{{ order.id ? 'Edit Order' : 'Add Order' }}</button>
    </nav>

    <div v-if="activeTab === 'list'">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Status</th>
            <th>Placed At</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id" @click="editOrder(o)" style="cursor:pointer;">
            <td>{{ o.id }}</td>
            <td>{{ o.status }}</td>
            <td>{{ o.placed_at }}</td>
            <td>{{ o.total }}</td>
            <td>
              <button class="btn btn-danger btn-sm" @click.stop="deleteOrder(o.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <form @submit.prevent="submitOrder" class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Customer ID (UUID)</label>
          <input type="text" class="form-control" v-model="order.customer_id" required />
        </div>

        <div class="col-md-4">
          <label class="form-label">Status</label>
          <select class="form-select" v-model="order.status" required>
            <option value="" disabled>Chọn trạng thái</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label">Placed At</label>
          <input type="datetime-local" class="form-control" v-model="order.placed_at" required />
        </div>

        <div class="col-md-4">
          <label class="form-label">Confirmed At</label>
          <input type="datetime-local" class="form-control" v-model="order.confirmed_at" />
        </div>

        <div class="col-md-4">
          <label class="form-label">Completed At</label>
          <input type="datetime-local" class="form-control" v-model="order.completed_at" />
        </div>

        <div class="col-md-4">
          <label class="form-label">Cancelled At</label>
          <input type="datetime-local" class="form-control" v-model="order.cancelled_at" />
        </div>

        <div class="col-md-12">
          <label class="form-label">Description</label>
          <textarea class="form-control" rows="2" v-model="order.description"></textarea>
        </div>

        <div class="col-md-3">
          <label class="form-label">Subtotal</label>
          <input type="number" class="form-control" v-model.number="order.subtotal" min="0" required />
        </div>

        <div class="col-md-3">
          <label class="form-label">Discount Total</label>
          <input type="number" class="form-control" v-model.number="order.discount_total" min="0" />
        </div>

        <div class="col-md-3">
          <label class="form-label">Tax Total</label>
          <input type="number" class="form-control" v-model.number="order.tax_total" min="0" />
        </div>

        <div class="col-md-3">
          <label class="form-label">Shipping Fee</label>
          <input type="number" class="form-control" v-model.number="order.shipping_fee" min="0" />
        </div>

        <div class="col-md-12">
          <label class="form-label">Total</label>
          <input type="number" class="form-control" v-model.number="order.total" min="0" required />
        </div>

        <div class="col-12">
          <button type="submit" class="btn btn-primary">{{ order.id ? 'Update' : 'Add' }}</button>
          <button type="button" class="btn btn-secondary ms-2" @click="resetForm">Reset</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watchEffect } from 'vue'
import { useOrderStore } from '@/milk-tea/admin/store/AdminOrderManage.js'

const orderStore = useOrderStore()

const order = reactive({
  id: '',
  customer_id: '',
  status: '',
  placed_at: '',
  confirmed_at: '',
  completed_at: '',
  cancelled_at: '',
  description: '',
  subtotal: 0,
  discount_total: 0,
  tax_total: 0,
  shipping_fee: 0,
  total: 0
})

const activeTab = ref('list')
const orders = ref([])

// Load dữ liệu khi mount
orderStore.loadOrders()

// Đồng bộ danh sách orders từ store sang local ref
watchEffect(() => {
  orders.value = orderStore.orders
})

function switchTab(tab) {
  activeTab.value = tab
}

function editOrder(o) {
  Object.assign(order, o)
  activeTab.value = 'detail'
}

function resetForm() {
  Object.assign(order, {
    id: '',
    customer_id: '',
    status: '',
    placed_at: '',
    confirmed_at: '',
    completed_at: '',
    cancelled_at: '',
    description: '',
    subtotal: 0,
    discount_total: 0,
    tax_total: 0,
    shipping_fee: 0,
    total: 0
  })
  activeTab.value = 'list'
}

async function submitOrder() {
  try {
    if (order.id) {
      await orderStore.updateOrder({ ...order })
      alert('Cập nhật đơn hàng thành công')
    } else {
      await orderStore.addOrder({ ...order })
      alert('Thêm đơn hàng thành công')
    }
    resetForm()
  } catch (error) {
    alert('Lỗi khi lưu đơn hàng: ' + error.message)
  }
}

async function deleteOrder(id) {
  if (confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
    try {
      await orderStore.removeOrder(id)
      alert('Xóa đơn hàng thành công')
    } catch (error) {
      alert('Lỗi khi xóa đơn hàng: ' + error.message)
    }
  }
}

</script>
