<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { authState, logout } from '@/milk-tea/account/store'
import { computed, onMounted, ref } from 'vue'
// Fallback: khởi tạo dropdown bằng JS nếu cần
import { Dropdown } from 'bootstrap'

const router = useRouter()
const isLoggedIn  = computed(() => !!authState.currentUser)
const displayName = computed(() => authState.currentUser?.fullName || '')

const handleLogout = () => {
  logout()
  router.push('/home')
}

// Fallback: đảm bảo dropdown hoạt động kể cả khi data-attr không bắt được
const userMenuBtn = ref(null)
onMounted(() => {
  if (userMenuBtn.value) {
    // eslint-disable-next-line no-new
    new Dropdown(userMenuBtn.value, { autoClose: true })
  }
})
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
    <div class="container">
      <!-- Logo -->
      <RouterLink class="navbar-brand d-flex align-items-center" to="/home">
        <img src="@/assets/images/logo.jpg" alt="Logo" style="height:64px" />
      </RouterLink>

      <!-- Toggle (mobile) -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menu -->
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav mx-lg-auto gap-lg-3 fw-semibold text-uppercase">
          <li class="nav-item"><RouterLink class="nav-link" to="/home">Trang chủ</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/news">News</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/products">Sản phẩm</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/store">Store</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/contact">Contact</RouterLink></li>
        </ul>

        <!-- Actions (right) -->
        <div class="d-flex align-items-center gap-2 mt-3 mt-lg-0">
          <!-- Cart -->
          <RouterLink to="/cart" class="btn btn-outline-secondary rounded-circle p-2" aria-label="Giỏ hàng">
            <i class="bi bi-cart"></i>
          </RouterLink>

          <!-- Chưa đăng nhập -->
          <template v-if="!isLoggedIn">
            <RouterLink to="/login" class="btn btn-outline-dark d-flex align-items-center gap-2">
              <i class="bi bi-box-arrow-in-right"></i><span>Đăng nhập</span>
            </RouterLink>
            
          </template>

          <!-- Đã đăng nhập -->
          <div v-else class="dropdown">
            <button
              class="btn btn-dark dropdown-toggle d-flex align-items-center gap-2"
              type="button"
              id="userMenu"
              data-bs-toggle="dropdown"
              data-bs-display="static"        
              aria-expanded="false"
              ref="userMenuBtn"              
            >
              <i class="bi bi-person-circle"></i>
              <span class="text-truncate" style="max-width: 160px">{{ displayName }}</span>
            </button>

            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu" style="z-index: 2000">
              <li>
                <RouterLink class="dropdown-item d-flex align-items-center gap-2" to="/account/profile">
                  <i class="bi bi-person"></i><span>Hồ sơ</span>
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item d-flex align-items-center gap-2" @click="handleLogout">
                  <i class="bi bi-box-arrow-right"></i><span>Đăng xuất</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
