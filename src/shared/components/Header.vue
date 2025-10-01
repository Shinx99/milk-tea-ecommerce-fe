<!-- src/shared/components/Header.vue -->
<script setup>
import { RouterLink, useRouter } from "vue-router";
import { authState, logout } from "@/milk-tea/account/store";
import { computed, ref, onMounted } from "vue";
import { Dropdown } from "bootstrap";

const router = useRouter();
const isLoggedIn = computed(() => !!authState.currentUser);
const displayName = computed(() => authState.currentUser?.fullName || "");

const handleLogout = () => {
  logout();
  router.push("/home");
};

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
          src="@/assets/images/logo.jpg"
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
        <RouterLink
          to="/cart"
          aria-label="Shopping cart"
          class="btn cart-btn position-relative"
        >
          <i class="bi bi-cart3"></i>
          <span
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            >2</span
          >
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
            <li>
              <RouterLink
                class="dropdown-item d-flex align-items-center gap-2"
                to="/account/profile"
              >
                <i class="bi bi-person"></i><span>Hồ sơ</span>
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
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* Full header vàng với gradient */
.site-header {
  background: linear-gradient(
    180deg,
    #fff8d6,
    #ffd54f
  ); /* vàng nhạt -> vàng đậm từ trên xuống */
  color: #8a3f3f;
}

/* Search bar */
.search-bar .input-group {
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.search-input {
  border: none;
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

.search-btn {
  background-color: #fff;
  color: #000;
  border: none;
  padding: 0 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-btn:hover {
  background-color: #f1e0a1; /* vàng nhạt khi hover */
}

/* Menu hover underline + brand color */
.menu-link {
  position: relative;
  transition: color 0.3s;
}
.menu-link:hover {
  color: #d35400; /* cam đậm */
}
.menu-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: #d35400;
  transition: width 0.3s;
}
.menu-link:hover::after {
  width: 100%;
}

/* Cart button */
.cart-btn {
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-btn i {
  font-size: 1.2rem;
}
.cart-btn:hover {
  background-color: #ffe082; /* vàng nhạt hover */
}
</style>
