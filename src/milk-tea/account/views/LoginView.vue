<!-- src/milk-tea/account/views/LoginView.vue -->
<script setup>
import { ref } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";
import { login } from "@/milk-tea/account/store";

const router = useRouter();
const route = useRoute();

const emailOrUsername = ref("");
const password = ref("");
const showPass = ref(false);
const remember = ref(false);
const err = ref("");

const onSubmit = () => {
  err.value = "";
  try {
    login({ emailOrUsername: emailOrUsername.value, password: password.value });
    const redirect = route.query?.redirect || "/home";
    router.push({ name: "Category" });
  } catch (e) {
    err.value = e.message || "Đăng nhập thất bại";
  }
};
</script>

<template>
  <section class="py-5" style="background-color: #f8f9fa">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-5">
          <div class="card shadow-sm">
            <div class="card-body p-4 p-lg-5">
              <h3 class="text-center mb-4">Đăng nhập</h3>

              <div v-if="err" class="alert alert-danger">{{ err }}</div>

              <form @submit.prevent="onSubmit" novalidate>
                <div class="mb-3">
                  <label class="form-label">Email hoặc Tên đăng nhập</label>
                  <input
                    v-model.trim="emailOrUsername"
                    class="form-control"
                    placeholder="you@example.com hoặc username"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Mật khẩu</label>
                  <div class="input-group">
                    <input
                      :type="showPass ? 'text' : 'password'"
                      v-model="password"
                      class="form-control"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showPass = !showPass"
                    >
                      <i
                        :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'"
                      ></i>
                    </button>
                  </div>
                </div>

                <div
                  class="d-flex justify-content-between align-items-center mb-4"
                >
                  <div class="form-check">
                    <input
                      id="remember"
                      class="form-check-input"
                      type="checkbox"
                      v-model="remember"
                    />
                    <label class="form-check-label" for="remember"
                      >Ghi nhớ đăng nhập</label
                    >
                  </div>
                  <RouterLink to="/forgot" class="small"
                    >Quên mật khẩu?</RouterLink
                  >
                </div>

                <button class="btn btn-dark w-100 mb-3" type="submit">
                  <i class="bi bi-box-arrow-in-right me-2"></i> Đăng nhập
                </button>

                <p class="text-center mb-0">
                  Chưa có tài khoản?
                  <RouterLink to="/register">Đăng ký</RouterLink>
                </p>
              </form>
            </div>
          </div>

          <div class="text-center mt-4">
            <img src="@/assets/images/logo.jpg" alt="logo" height="48" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
