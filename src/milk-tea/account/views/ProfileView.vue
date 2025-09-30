<script setup>
import { authState } from '@/milk-tea/account/store'
</script>

<template>
  <div class="container py-5" style="max-width: 720px">
    <div class="card shadow-sm">
      <div class="card-body p-4">
        <h4 class="mb-4">Hồ sơ cá nhân</h4>

        <!-- Đúng cú pháp: v-if / v-else là 2 anh em -->
        <div v-if="authState.currentUser">
          <div class="row g-3 align-items-center">
            <div class="col-auto">
              <img
                :src="authState.currentUser.avatar || 'https://via.placeholder.com/80x80?text=User'"
                alt="avatar"
                class="rounded-circle border"
                width="80" height="80"
              />
            </div>
            <div class="col">
              <p class="mb-1"><strong>Họ tên:</strong> {{ authState.currentUser.fullName }}</p>
              <p class="mb-1"><strong>Tên đăng nhập:</strong> {{ authState.currentUser.username }}</p>
              <p class="mb-1"><strong>Email:</strong> {{ authState.currentUser.email }}</p>
              <p class="mb-0"><strong>SĐT:</strong> {{ authState.currentUser.phone || '—' }}</p>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="alert alert-warning mb-0">
            Bạn chưa đăng nhập.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
