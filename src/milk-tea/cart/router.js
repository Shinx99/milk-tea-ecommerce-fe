// src/milk-tea/cart/router.js
import CartView from './views/CartView.vue'

const cartRoutes = [
  {
    path: '/cart',
    component: CartView,
    meta: { authOnly: false }
  }
]

export default cartRoutes   // ⬅️ bắt buộc phải có dòng này
