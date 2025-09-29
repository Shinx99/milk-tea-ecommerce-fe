<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { authState, logout } from '@/milk-tea/account/store'
import { onMounted, ref } from 'vue'
import { Dropdown } from 'bootstrap' // ⬅️ dùng JS API của Bootstrap

const router = useRouter()
const userMenuBtn = ref(null) // ⬅️ tham chiếu nút dropdown

const handleLogout = () => {
  logout()
  router.push('/home')
}

// Khởi tạo dropdown thủ công (dù data-bs-toggle thường đủ)
onMounted(() => {
  if (userMenuBtn.value) {
    // eslint-disable-next-line no-new
    new Dropdown(userMenuBtn.value)
  }
})
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
    <div class="container">
      <RouterLink class="navbar-brand d-flex align-items-center" to="/home">
        <img src="@/assets/images/logo.png" alt="Logo" style="height:64px" />
      </RouterLink>

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

      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav mx-lg-auto gap-lg-3 fw-semibold text-uppercase">
          <li class="nav-item"><RouterLink class="nav-link" to="/home">Home</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/news">News</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/menu">Menu</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/store">Store</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/contact">Contact</RouterLink></li>
        </ul>

        <div class="d-flex align-items-center gap-2 mt-3 mt-lg-0">
          <a href="#" class="btn btn-outline-secondary rounded-circle p-2"><i class="bi bi-facebook"></i></a>
          <a href="#" class="btn btn-outline-secondary rounded-circle p-2"><i class="bi bi-instagram"></i></a>

          <!-- Chưa đăng nhập -->
          <template v-if="!authState.currentUser">
            <RouterLink to="/login" class="btn btn-outline-dark d-flex align-items-center gap-2">
              <i class="bi bi-box-arrow-in-right"></i><span>Đăng nhập</span>
            </RouterLink>
            <RouterLink to="/register" class="btn btn-dark d-flex align-items-center gap-2">
              <i class="bi bi-person-plus"></i><span>Đăng ký</span>
            </RouterLink>
          </template>

          <!-- Đã đăng nhập -->
          <div v-else class="dropdown">
            <button
              class="btn btn-outline-dark dropdown-toggle d-flex align-items-center gap-2"
              type="button"
              id="userMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              ref="userMenuBtn"         
            >
              <i class="bi bi-person-circle"></i>
              <span class="text-truncate" style="max-width: 160px">
                {{ authState.currentUser.fullName }}
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
              <li>
                <RouterLink class="dropdown-item d-flex align-items-center gap-2" to="/account/profile">
                  <i class="bi bi-person"></i> <span>Hồ sơ</span>
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item d-flex align-items-center gap-2" @click="handleLogout">
                  <i class="bi bi-box-arrow-right"></i> <span>Đăng xuất</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
