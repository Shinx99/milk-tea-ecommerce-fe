<template>
  <section class="container py-5" style="max-width: 400px;">
    <div class="card shadow-sm">
      <div class="card-body p-4">
        <h4 class="mb-4 text-center">Đổi mật khẩu</h4>

        <div v-if="msg" class="alert alert-success">{{ msg }}</div>
        
        <div v-if="err" class="alert alert-danger">{{ err }}</div>

        <form @submit.prevent="onSubmit">
          <div class="mb-3">
            <label class="form-label">Mật khẩu cũ</label>
            <input v-model="oldPassword" type="password" class="form-control" required />
          </div>
          
          <div class="mb-3">
            <label class="form-label">Mật khẩu mới</label>
            <input v-model="newPassword" type="password" class="form-control" required />
          </div>
          
          <div class="mb-3">
            <label class="form-label">Xác nhận mật khẩu mới</label>
            <input v-model="confirmPassword" type="password" class="form-control" required />
          </div>
          
          <button class="btn btn-dark w-100" type="submit">Xác nhận đổi</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/milk-tea/account/store"; // Đường dẫn tới store

const userStore = useUserStore();

// Form states
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

// Message states
const msg = ref("");
const err = ref("");

// Xóa trắng form
const clearForm = () => {
  oldPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
};

const onSubmit = async () => {
  // Xóa thông báo cũ
  msg.value = "";
  err.value = "";

  // 1. Kiểm tra validation phía client
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    err.value = "Vui lòng nhập đầy đủ thông tin.";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    err.value = "Mật khẩu mới và xác nhận không khớp.";
    return;
  }
  if (newPassword.value.length < 6) {
    err.value = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    return;
  }
  if (oldPassword.value === newPassword.value) {
    err.value = "Mật khẩu mới phải khác mật khẩu cũ.";
    return;
  }

  try {
    // 2. Gọi action từ Pinia store
    await userStore.changePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
      // (Backend DTO của bạn có thể không cần confirmPassword, 
    });

    // 3. Xử lý thành công
    msg.value = "Đổi mật khẩu thành công!";
    err.value = "";
    clearForm();

  } catch (e) {
    // 4. Xử lý lỗi (ví dụ: "Mật khẩu cũ không đúng")
    err.value = e?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.";
  }
};
</script>