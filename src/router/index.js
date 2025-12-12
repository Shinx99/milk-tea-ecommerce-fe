import { createRouter, createWebHistory } from "vue-router";
import Home from "@/milk-tea/home/views/HomeView.vue";
import accountRoutes from "@/milk-tea/account/router";
import { useUserStore } from "@/milk-tea/account/store"; // Sử dụng Pinia store
import productRoutes from "@/milk-tea/product/router";
import cartRoutes from "@/milk-tea/cart/router";
import orderRoutes from "@/milk-tea/order/router";
import paymentRoutes from "@/milk-tea/payment/router";
import StoreView from "../milk-tea/store/StoreView.vue";

// SỬA: Import AdminLayout (Layout Fixed Sidebar) thay vì AdminDashboardView
import AdminLayout from "@/milk-tea/admin/components/AdminLayout.vue";
import adminRoutes from "@/milk-tea/admin/router";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home },

  // === KHỐI ADMIN: TÁCH BIỆT HOÀN TOÀN ===
  {
    path: "/admin",
    // SỬA: Dùng key 'component' và trỏ đến AdminLayout
    component: AdminLayout,
    meta: {
      authOnly: true,
      roles: ["admin"], // Nên có logic kiểm tra vai trò tại đây
      layout: "admin", // <<< QUAN TRỌNG: Flag cho App.vue
    },
    children: [
      // THÊM REDIRECT: Khi truy cập /admin, chuyển hướng đến trang categories (hoặc trang Dashboard chính)
      { path: "", redirect: { name: "admin-categories" } },
      ...adminRoutes, // Nhúng các route con (products, categories, v.v.)
    ],
  },

  // === CÁC ROUTES CÔNG CỘNG KHÁC (Giữ nguyên) ===
  ...accountRoutes,
  ...productRoutes,
  ...cartRoutes,
  ...orderRoutes,
  ...paymentRoutes,
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

  // Tùy chọn: Thêm logic kiểm tra roleAdmin vào đây để bảo vệ routes Admin
  const requiresAdmin = to.matched.some(
    (record) => record.meta.roles && record.meta.roles.includes("admin")
  );
  if (requiresAdmin && userStore.userInfo?.roleName !== "admin") {
    // Nếu yêu cầu Admin nhưng người dùng không phải Admin, chuyển hướng
    return { path: "/home" };
  }

  if (to.meta?.guestOnly && isLoggedIn) return { path: "/home" };
  if (to.meta?.authOnly && !isLoggedIn)
    return { path: "/login", query: { redirect: to.fullPath } };
});

export default router;
