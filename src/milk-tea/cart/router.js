import CartView from './views/CartView.vue'

export default [
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
    meta: { authOnly: false }
  }
]