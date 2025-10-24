<template>
  <div class="container py-4">
    <h2 class="mb-4">📈 Thống kê Kinh Doanh</h2>

    <!-- Tabs chọn loại thời gian -->
    <div class="d-flex flex-wrap" style="gap:32px; align-items: flex-start;">
      <!-- Bên trái: bảng hoặc loader hoặc empty -->
      <div style="flex:1; min-width:360px;">
        <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height:260px;">
          <div class="spinner-border text-primary" style="width:2.3rem; height:2.3rem;"></div>
        </div>
        <table v-else-if="stats.length" class="table table-bordered table-hover shadow-sm" style="border-radius:14px;overflow:hidden;">
          <thead class="table-light">
            <tr>
              <th>Khoảng thời gian</th>
              <th>Loại hàng</th>
              <th>Tổng doanh thu</th>
              <th>Tổng số lượng</th>
              <th>Giá cao nhất</th>
              <th>Giá thấp nhất</th>
              <th>Giá trung bình</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in stats" :key="item.period + item.categoryName">
              <td>{{ item.period }}</td>
              <td>{{ item.categoryName }}</td>
              <td>{{ formatCurrency(item.totalRevenue) }}</td>
              <td>{{ item.totalQuantity }}</td>
              <td>{{ formatCurrency(item.maxPrice) }}</td>
              <td>{{ formatCurrency(item.minPrice) }}</td>
              <td>{{ formatCurrency(item.avgPrice) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-secondary mx-2 my-4 text-center" style="font-size:1.12em;min-height:200px;display:flex;justify-content:center;align-items:center;">
          Không có dữ liệu thống kê.
        </div>
      </div>
      <!-- Bên phải: form nhập/nhấn -->
      <div style="min-width:320px; max-width:420px; width:100%;">
        <div class="card shadow-sm p-3 mb-4 border-0" style="border-radius:16px;">
          <div class="mb-3 fw-bold">Chọn khoảng thời gian</div>
          <select class="form-select mb-3" v-model="period" @change="resetInputs">
            <option value="daily">Ngày</option>
            <option value="weekly">Tuần</option>
            <option value="monthly">Tháng</option>
            <option value="yearly">Năm</option>
          </select>
          <template v-if="period === 'daily'">
            <input type="date" class="form-control mb-2" v-model="params.startDate" />
            <input type="date" class="form-control" v-model="params.endDate" />
          </template>
          <template v-else-if="period === 'weekly'">
            <input type="text" class="form-control mb-2" placeholder="YYYY-Wxx" v-model="params.startWeek" />
            <input type="text" class="form-control" placeholder="YYYY-Wxx" v-model="params.endWeek" />
          </template>
          <template v-else-if="period === 'monthly'">
            <input type="month" class="form-control mb-2" v-model="params.startMonth" />
            <input type="month" class="form-control" v-model="params.endMonth" />
          </template>
          <template v-else-if="period === 'yearly'">
            <input type="number" min="2000" class="form-control mb-2" placeholder="Năm bắt đầu" v-model="params.startYear" />
            <input type="number" min="2000" class="form-control" placeholder="Năm kết thúc" v-model="params.endYear" />
          </template>
          <div class="mt-3 d-flex gap-2">
            <button class="btn btn-primary w-50" @click="refreshAndFetchStats" :disabled="loading">
              Làm mới dữ liệu
            </button>
            <button class="btn btn-success w-50" @click="exportExcel" :disabled="loading">
              Xuất file Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref } from 'vue'
    import * as XLSX from 'xlsx'
    import { saveAs } from 'file-saver'
    import AdminStatisticsStore from '../store/AdminStatistics.js'

    const period = ref('monthly')
    const params = ref({ startMonth: '', endMonth: '' })
    const stats = ref([])
    const loading = ref(false)

    function resetInputs() {
      params.value = {}
    }

    async function refreshAndFetchStats() {
      try {
        loading.value = true
        await AdminStatisticsStore.refreshViews()
        stats.value = await AdminStatisticsStore.fetchStats(period.value, params.value)
      } catch (err) {
        // Có thể thêm toast/thông báo lỗi ở đây nếu muốn
        stats.value = []
      } finally {
        loading.value = false
      }
    }


    function exportExcel() {
      if (!stats.value.length) return
      const data = stats.value.map(item => ({
        'Khoảng thời gian': item.period,
        'Loại hàng': item.categoryName,
        'Tổng doanh thu': item.totalRevenue,
        'Tổng số lượng': item.totalQuantity,
        'Giá cao nhất': item.maxPrice,
        'Giá thấp nhất': item.minPrice,
        'Giá trung bình': item.avgPrice,
      }))
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Thống kê')
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'thong_ke_kinh_doanh.xlsx')
    }

    function formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    }
</script>
