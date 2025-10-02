import Category from './components/AdminCategoryManage.vue'
import Order from './components/AdminOrderManage.vue'
import Product from './components/AdminProductManage.vue'

export default [
  { path: 'category', name: 'AdminCategory', component: Category },
  { path: 'order', name: 'AdminOrder', component: Order },
  { path: 'product', name: 'AdminProduct', component: Product }
]
