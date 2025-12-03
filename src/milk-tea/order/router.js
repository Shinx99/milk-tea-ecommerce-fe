// src/milk-tea/order/router.js

const orderRoutes = [
//   {
//   path: '/checkout',
//   name: 'OrderPreview',
//   component: () => import('@/milk-tea/order/views/CheckoutOrderView.vue')
// }

{
    path: '/orders/:id',
    name: 'OrderDetail',
    component: () => import('@/milk-tea/order/views/OrderDetailView.vue')
  },
  {
    path: '/checkout',
    name: 'OrderPreview',
    component: () => import('@/milk-tea/order/views/CheckoutOrderView.vue')
  }

]

export default orderRoutes   
