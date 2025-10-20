<template>
  <section class="container py-5" style="max-width: 400px;">
    <div class="card shadow-sm">
      <div class="card-body p-4">
        <h4 class="mb-4 text-center">Đặt lại mật khẩu</h4>
        
        <div v-if="msg" class="alert alert-success">{{ msg }}</div>
        <div v-if="err" class="alert alert-danger">{{ err }}</div>

        <form @submit.prevent="onSubmit" v-if="!msg">
          <div class="mb-3">
            <label class="form-label">Mật khẩu mới</label>
            <input v-model="newPassword" type="password" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Xác nhận mật khẩu mới</label>
            <input v-model="confirmPassword" type="password" class="form-control" required />
          </div>
          <button class="btn btn-dark w-100" type="submit">Xác nhận</button>
        </form>
        
        <div v-if="msg" class="text-center mt-3">
          <router-link to="/login">Quay lại đăng nhập</router-link>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/milk-tea/account/store";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const token = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const msg = ref("");
const err = ref("");

// Lấy token từ URL khi component được tải
onMounted(() => {
  token.value = route.query.token;
  if (!token.value) {
    err.value = "Token không hợp lệ hoặc đã hết hạn.";
  }
});

const onSubmit = async () => {
  msg.value = "";
  err.value = "";

  if (!token.value) {
    err.value = "Token không hợp lệ.";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    err.value = "Mật khẩu xác nhận không khớp.";
    return;
  }
  if (newPassword.value.length < 6) { // Ví dụ: validation đơn giản
    err.value = "Mật khẩu phải có ít nhất 6 ký tự.";
    return;
  }

  try {
    await userStore.resetPassword({ 
      token: token.value, 
      newPassword: newPassword.value, 
      confirmPassword: confirmPassword.value
    });
    msg.value = "Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.";
  } catch (e) {
    err.value = e?.message || "Đặt lại mật khẩu thất bại. Token có thể đã hết hạn.";
  }
};
</script>