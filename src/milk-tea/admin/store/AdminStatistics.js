import axios from 'axios'

function getEndpoint(period, params) {
  if (period === 'daily') {
    return `/api/statistics/revenue/daily?startDate=${params.startDate}&endDate=${params.endDate}`
  }
  if (period === 'weekly') {
    return `/api/statistics/revenue/weekly?startWeek=${params.startWeek}&endWeek=${params.endWeek}`
  }
  if (period === 'monthly') {
    return `/api/statistics/revenue/monthly?startMonth=${params.startMonth}&endMonth=${params.endMonth}`
  }
  if (period === 'yearly') {
    return `/api/statistics/revenue/yearly?startYear=${params.startYear}&endYear=${params.endYear}`
  }
}

export default {
  async refreshViews() {
    await axios.post('/api/statistics/refresh')
  },
  async fetchStats(period, params) {
    const url = getEndpoint(period, params)
    try {
      const response = await axios.get(url)
      return response.data.map(row => ({
        period: row.period_day || row.period_week || row.period_month || row.period_year || '', 
        categoryName: row.category_name || row.categoryName || row.category || '',
        totalRevenue: row.total_revenue || row.totalRevenue || 0,
        totalQuantity: row.total_quantity || row.totalQuantity || 0,
        maxPrice: row.max_price || row.maxPrice || 0,
        minPrice: row.min_price || row.minPrice || 0,
        avgPrice: row.avg_price || row.avgPrice || 0,
      }))
    } catch {
      return []
    }
  }
}
