<template>
  <section class="container py-5" style="max-width: 400px;">
    <div class="card shadow-sm">
      <div class="card-body p-4">
        <h4 class="mb-4 text-center">Quên mật khẩu</h4>
        <div v-if="msg" class="alert alert-success">{{ msg }}</div>
        <div v-if="err" class="alert alert-danger">{{ err }}</div>

        <form @submit.prevent="onSubmit">
          <div class="mb-3">
            <label class="form-label">Nhập email đã đăng ký</label>
            <input v-model.trim="email" type="email" class="form-control" placeholder="you@example.com" required />
          </div>
          <button class="btn btn-dark w-100" type="submit">Gửi yêu cầu</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/milk-tea/account/store";

const userStore = useUserStore();

const email = ref("");
const msg = ref("");
const err = ref("");

const onSubmit = async () => {
  msg.value = "";
  err.value = "";

  if (!email.value) {
    err.value = "Vui lòng nhập email hợp lệ!";
    return;
  }

  try {
    await userStore.forgotPassword(email.value);
    msg.value = "Yêu cầu đặt lại mật khẩu đã được gửi! Hãy kiểm tra email của bạn.";
  } catch (e) {
    err.value = e?.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.";
  }

};
</script>
