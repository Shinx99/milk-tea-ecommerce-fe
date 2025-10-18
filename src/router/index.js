import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/milk-tea/home/views/HomeView.vue'
import accountRoutes from '@/milk-tea/account/router'
import { authState } from '@/milk-tea/account/store'
import productRoutes from '@/milk-tea/product/router'   // ⬅️ dùng default export
import cartRoutes from '@/milk-tea/cart/router'   // <-- default import

import AdminDashboardView from '@/milk-tea/admin/views/AdminDashboardView.vue'
import adminRoutes from '@/milk-tea/admin/router'  // <-- default import

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/admin', component: AdminDashboardView, meta: { authOnly: true }, children: adminRoutes }, // Thêm dòng này cho Admin

  ...accountRoutes,
  ...productRoutes,
  ...cartRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const isLoggedIn = !!authState.currentUser;
  if (to.meta?.guestOnly && isLoggedIn) return { path: "/home" };
  if (to.meta?.authOnly && !isLoggedIn)
    return { path: "/login", query: { redirect: to.fullPath } };
});

export default router
