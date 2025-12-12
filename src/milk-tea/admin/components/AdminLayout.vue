<script setup>
import AdminSidebar from "./Admin.vue"; // Component Sidebar riêng biệt
import { RouterLink, useRouter } from "vue-router";
import { useUserStore } from "@/milk-tea/account/store"; // Import Store để xử lý Logout

const userStore = useUserStore();
const router = useRouter();

// Logic Logout riêng cho Admin
const handleLogout = () => {
  userStore.logout();
  // Chuyển về trang đăng nhập hoặc trang chủ sau khi logout
  router.push("/home");
};
</script>

<template>
  <div class="admin-wrapper">
    <AdminSidebar />

    <div class="main-content-wrapper">
      <header class="admin-top-header sticky-top shadow-sm">
        <div
          class="d-flex justify-content-between align-items-center h-100 px-4"
        >
          <RouterLink
            to="/home"
            class="text-decoration-none fw-bold text-muted"
            style="font-size: 1.1em"
          >
            <i class="fa-solid fa-store me-2"></i> Trở về Shop
          </RouterLink>

          <div class="d-flex align-items-center gap-3">
            <i class="fa-solid fa-bell fa-lg text-muted cursor-pointer"></i>
            <div class="dropdown">
              <button
                class="btn btn-dark dropdown-toggle d-flex align-items-center gap-2"
                type="button"
                id="adminMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="fa-solid fa-user-circle"></i>
                <span class="text-truncate" style="max-width: 160px"
                  >Administrator</span
                >
              </button>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="adminMenu"
                style="z-index: 2000"
              >
                <li>
                  <button
                    class="dropdown-item d-flex align-items-center gap-2"
                    @click="handleLogout"
                  >
                    <i class="bi bi-box-arrow-right"></i><span>Đăng xuất</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <main class="content-view p-4">
        <router-view></router-view>
      </main>

      <footer
        class="admin-footer text-center p-3 small text-muted border-top mt-auto"
      >
        &copy; 2024 Milk Tea Admin Dashboard. All rights reserved.
      </footer>
    </div>
  </div>
</template>

<style scoped>
:root {
  --sidebar-width: 250px;
  --header-height: 60px;
}

.admin-wrapper {
  display: flex;
  min-height: 100vh; /* Đảm bảo wrapper chiếm toàn bộ chiều cao màn hình */
}

/* Container cho phần nội dung chính */
.main-content-wrapper {
  margin-left: 250px;
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex; /* QUAN TRỌNG: Dùng flex để đẩy Footer xuống cuối */
  flex-direction: column;
}

/* Header Top Bar */
.admin-top-header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  z-index: 1030;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
}

/* Nội dung Router View */
.content-view {
  padding-top: 20px !important;
  flex-grow: 1; /* QUAN TRỌNG: Nội dung chiếm hết không gian còn lại */
}

/* Admin Footer */
.admin-footer {
  background-color: #ffffff;
}
</style>
