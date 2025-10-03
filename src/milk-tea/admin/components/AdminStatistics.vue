<!-- src/milk-tea/admin/components/AdminStatistics.vue -->
<template>
  <div class="container py-4">
    <h2 class="mb-4">📈 Thống kê Kết Quả Kinh Doanh</h2>

    <!-- Doanh thu theo loại hàng -->
    <section class="mb-5">
      <h4>Doanh thu theo loại hàng</h4>
      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th>Loại hàng</th>
            <th>Tổng doanh thu</th>
            <th>Tổng số lượng</th>
            <th>Giá cao nhất</th>
            <th>Giá thấp nhất</th>
            <th>Giá trung bình</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in revenueStats" :key="item.category">
            <td>{{ item.category }}</td>
            <td>{{ formatCurrency(item.totalRevenue) }}</td>
            <td>{{ item.totalQuantity }}</td>
            <td>{{ formatCurrency(item.maxPrice) }}</td>
            <td>{{ formatCurrency(item.minPrice) }}</td>
            <td>{{ formatCurrency(item.avgPrice) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Top 10 khách hàng VIP -->
    <section>
      <h4>Top 10 khách hàng VIP</h4>
      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th>Tên khách hàng</th>
            <th>Tổng tiền đã mua</th>
            <th>Ngày mua đầu tiên</th>
            <th>Ngày mua sau cùng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in vipCustomers" :key="customer.name">
            <td>{{ customer.name }}</td>
            <td>{{ formatCurrency(customer.totalSpent) }}</td>
            <td>{{ formatDate(customer.firstPurchase) }}</td>
            <td>{{ formatDate(customer.lastPurchase) }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Dữ liệu thống kê
const revenueStats = ref([])
const vipCustomers = ref([])

onMounted(async () => {
  const [products, categories, orders, users] = await Promise.all([
    fetch('/product_data/products.json').then(res => res.json()),
    fetch('/admin_data/category.json').then(res => res.json()),
    fetch('/admin_data/orders.manage.json').then(res => res.json()),
    fetch('/account_data/users.json').then(res => res.json())
  ])

  // Thống kê doanh thu theo loại hàng
  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]))
  const grouped = {}

  for (const order of orders) {
    for (const item of order.items) {
      const product = products.find(p => p.id === item.productId)
      if (!product) continue

      const catId = product.categoryId
      if (!grouped[catId]) {
        grouped[catId] = {
          category: categoryMap[catId] || 'Không rõ',
          totalRevenue: 0,
          totalQuantity: 0,
          prices: []
        }
      }

      grouped[catId].totalRevenue += item.price * item.quantity
      grouped[catId].totalQuantity += item.quantity
      grouped[catId].prices.push(item.price)
    }
  }

  revenueStats.value = Object.values(grouped).map(stat => ({
    ...stat,
    maxPrice: Math.max(...stat.prices),
    minPrice: Math.min(...stat.prices),
    avgPrice: Math.round(stat.prices.reduce((a, b) => a + b, 0) / stat.prices.length)
  }))

  // Thống kê khách hàng VIP
  const customerMap = {}
  for (const order of orders) {
    const userId = order.userId
    if (!customerMap[userId]) {
      customerMap[userId] = {
        totalSpent: 0,
        firstPurchase: order.date,
        lastPurchase: order.date
      }
    }

    const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    customerMap[userId].totalSpent += total
    customerMap[userId].firstPurchase = new Date(customerMap[userId].firstPurchase) > new Date(order.date)
      ? order.date
      : customerMap[userId].firstPurchase
    customerMap[userId].lastPurchase = new Date(customerMap[userId].lastPurchase) < new Date(order.date)
      ? order.date
      : customerMap[userId].lastPurchase
  }

  vipCustomers.value = Object.entries(customerMap)
    .map(([userId, data]) => {
      const user = users.find(u => u.id === userId)
      return {
        name: user?.fullName || 'Không rõ',
        ...data
      }
    })
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10)
})

// Format tiền tệ
function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

// Format ngày
function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN')
}
</script>