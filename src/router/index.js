import { createRouter, createWebHistory } from "vue-router";
import Home from "@/milk-tea/home/views/HomeView.vue";
import accountRoutes from "@/milk-tea/account/router";
import { useUserStore } from "@/milk-tea/account/store"; // Sử dụng Pinia store
import productRoutes from "@/milk-tea/product/router";
import cartRoutes from "@/milk-tea/cart/router";
import HomeView from "../milk-tea/home/views/HomeView.vue";
import StoreView from "../milk-tea/store/StoreView.vue";

import AdminDashboardView from "@/milk-tea/admin/views/AdminDashboardView.vue";
import adminRoutes from "@/milk-tea/admin/router";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home },
  {
    path: "/admin",
    componentADMIN: AdminDashboardView,
    meta: { authOnly: true },
    children: adminRoutes,
  },
  ...accountRoutes,
  ...productRoutes,
  ...cartRoutes,
  { path: "/store", component: StoreView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Sử dụng Pinia trong router guard
router.beforeEach((to) => {
  const userStore = useUserStore(); // Khởi tạo Store
  const isLoggedIn = !!userStore.token && !!userStore.userInfo;
  if (to.meta?.guestOnly && isLoggedIn) return { path: "/home" };
  if (to.meta?.authOnly && !isLoggedIn)
    return { path: "/login", query: { redirect: to.fullPath } };
});

export default router;
