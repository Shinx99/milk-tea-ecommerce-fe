import Category from './components/AdminCategoryManage.vue'
import Order from './components/AdminOrderManage.vue'
import Product from './components/AdminProductManage.vue'
import Voucher from './components/AdminVoucherManage.vue'
import Statistics from './components/AdminStatistics.vue'

export default [
  { path: 'category', name: 'AdminCategory', component: Category },
  { path: 'order', name: 'AdminOrder', component: Order },
  { path: 'product', name: 'AdminProduct', component: Product },
  { path: 'voucher', name: 'AdminVoucher', component: Voucher},
  { path: 'statistics', name: 'AdminStatistics', component: Statistics }
]
