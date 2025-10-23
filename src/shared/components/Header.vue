<!-- src/shared/components/Header.vue -->
<script setup>
import { RouterLink, useRouter } from "vue-router";
import { computed, ref, onMounted } from "vue";
import { Dropdown } from "bootstrap";
import { cartCount } from "@/milk-tea/cart/store";
import { useUserStore } from "@/milk-tea/account/store";

const userStore = useUserStore();

const router = useRouter();
const isLoggedIn = computed(() => !!userStore.token && !!userStore.userInfo);
const displayName = computed(() => userStore.userInfo?.fullName || "");

//logic Logout, gọi từ feature accound
const handleLogout = () => {
  userStore.logout();
  router.push("/home");
};

// Check vai trò admin (roleName backend trả về dạng roleName)
const isAdmin = computed(() => userStore.userInfo?.roleName === "admin");

//Vuong them vao
const isCustomer = computed(() => userStore.userInfo?.roleName === "customer");

// Search keyword
const keyword = ref("");
function onSearch() {
  if (keyword.value.trim()) {
    console.log("Searching:", keyword.value);
    // router.push({ path: "/products", query: { q: keyword.value } })
  }
}

// bootstrap dropdown fallback
const userMenuBtn = ref(null);
onMounted(() => {
  if (userMenuBtn.value) {
    new Dropdown(userMenuBtn.value, { autoClose: true });
  }
});
</script>

<template>
  <header class="site-header border-bottom shadow-sm">
    <!-- Tầng 1 -->
    <div
      class="container py-3 d-flex align-items-center justify-content-between"
    >
      <!-- Logo -->
      <RouterLink
        to="/home"
        class="navbar-brand me-4"
        aria-label="Milk Tea Home"
      >
        <img
          src="@/assets/images/logo.png"
          alt="Milk Tea E-commerce Logo"
          height="64"
        />
      </RouterLink>

      <!-- Search -->
      <form class="search-bar flex-grow-0 w-50" @submit.prevent="onSearch">
        <div class="input-group">
          <input
            v-model="keyword"
            type="text"
            class="form-control search-input"
            placeholder="Tìm kiếm sản phẩm..."
            aria-label="Search input"
          />
          <button
            class="btn search-btn"
            type="submit"
            aria-label="Search button"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
      </form>

      <!-- Icons -->
      <div class="d-flex align-items-center gap-3 ms-4">
        <!-- Cart -->
        <RouterLink to="/cart" class="btn position-relative">
          <i class="bi bi-cart3"></i>
          <span
            v-if="cartCount"
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >
            {{ cartCount }}
          </span>
        </RouterLink>

        <!-- User -->
        <template v-if="!isLoggedIn">
          <RouterLink
            to="/login"
            aria-label="Login"
            class="btn btn-outline-dark d-flex align-items-center gap-2"
          >
            <i class="bi bi-box-arrow-in-right"></i><span>Đăng nhập</span>
          </RouterLink>
        </template>
        <div v-else class="dropdown">
          <button
            class="btn btn-dark dropdown-toggle d-flex align-items-center gap-2"
            type="button"
            id="userMenu"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            ref="userMenuBtn"
          >
            <i class="bi bi-person-circle"></i>
            <span class="text-truncate" style="max-width: 160px">{{
              displayName
            }}</span>
          </button>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="userMenu"
            style="z-index: 2000"
          >
            <!--Vuong them vao - khong co loi-->
            <li v-if="isCustomer">
              <RouterLink
                class="dropdown-item d-flex align-items-center gap-2"
                to="/account/profile"
              >
                <i class="bi bi-person"></i><span>Hồ sơ</span>
              </RouterLink>
            </li>
            <li v-if="isCustomer">
              <RouterLink
                class="dropdown-item d-flex align-items-center gap-2"
                to="/account/change-password"
              >
                <i class="bi bi-person"></i><span>Doi mat khau</span>
              </RouterLink>
            </li>

            <li><hr class="dropdown-divider" /></li>
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

    <!-- Tầng 2 -->
    <nav class="border-top" aria-label="Main Navigation">
      <div class="container d-flex justify-content-center">
        <ul class="nav nav-pills py-2 gap-4 fw-semibold text-uppercase">
          <li class="nav-item">
            <RouterLink class="nav-link menu-link" to="/home"
              >Trang chủ</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link menu-link" to="/products"
              >Sản phẩm</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link menu-link" to="/news"
              >Khuyến mãi</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link menu-link" to="/store"
              >Store</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link menu-link" to="/contact"
              >Contact</RouterLink
            >
          </li>
          <li class="nav-item" v-if="isAdmin">
            <div class="dropdown">
              <button
                class="nav-link menu-link dropdown-toggle"
                type="button"
                id="adminMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                ADMIN
              </button>
              <ul class="dropdown-menu">
                <li>
                  <RouterLink class="dropdown-item" to="/admin/category"
                    >CATEGORIES</RouterLink
                  >
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/admin/order"
                    >ORDER</RouterLink
                  >
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/admin/product"
                    >PRODUCT</RouterLink
                  >
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/admin/voucher"
                    >VOUCHER</RouterLink
                  >
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/admin/statistics"
                    >STATISTICS</RouterLink
                  >
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/admin/customer"
                    >CUSTOMER</RouterLink
                  >
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
