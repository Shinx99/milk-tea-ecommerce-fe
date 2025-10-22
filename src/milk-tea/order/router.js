import CheckoutView from './views/CheckoutView.vue'
import OrderHistoryView from './views/OrderHistoryView.vue'

export default [
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView,
    meta: { authOnly: true }
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrderHistoryView,
    meta: { authOnly: true }
  }
]