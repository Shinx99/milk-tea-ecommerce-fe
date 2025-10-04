<template>
  <section class="py-5" style="background-color:#f8f9fa;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body p-4 p-lg-5">
              <h3 class="text-center mb-4">Đăng ký</h3>

              <div v-if="err" class="alert alert-danger">{{ err }}</div>
              <div v-if="ok" class="alert alert-success">{{ ok }}</div>

              <form @submit.prevent="onSubmit" novalidate>
                <div class="mb-3">
                  <label class="form-label">Họ và tên</label>
                  <input v-model.trim="fullName" type="text" class="form-control" placeholder="Nguyễn Văn A" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">Tên đăng nhập</label>
                  <input v-model.trim="username" type="text" class="form-control" placeholder="username123" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model.trim="email" type="email" class="form-control" placeholder="you@example.com" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">Số điện thoại</label>
                  <input v-model.trim="phone" type="tel" class="form-control" placeholder="0987654321" />
                </div>

                <div class="mb-3">
                  <label class="form-label">Địa chỉ</label>
                  <textarea v-model.trim="address" rows="2" class="form-control" placeholder="123 Đường ABC, Quận 1, TP.HCM"></textarea>
                </div>

                <div class="mb-3">
                  <label class="form-label">Mật khẩu</label>
                  <div class="input-group">
                    <input :type="showPass ? 'text' : 'password'" v-model="password" class="form-control" placeholder="••••••••" required />
                    <button type="button" class="btn btn-outline-secondary" @click="showPass=!showPass" aria-label="toggle password">
                      <i :class="showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                    </button>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Xác nhận mật khẩu</label>
                  <input :type="showPass ? 'text':'password'" v-model="confirmPassword" class="form-control" placeholder="Nhập lại mật khẩu" required />
                </div>

                <button class="btn btn-dark w-100 mb-3" type="submit">
                  <i class="fa-solid fa-user-plus me-2"></i> Đăng ký
                </button>

                <p class="text-center mb-0">
                  Đã có tài khoản?
                  <RouterLink to="/login">Đăng nhập</RouterLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/milk-tea/account/store' // dùng store mini, không Pinia

const router = useRouter()

const fullName = ref('')
const username = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPass = ref(false)

const err = ref('')
const ok  = ref('')

const onSubmit = () => {
  err.value = ''; ok.value = ''
  if (password.value !== confirmPassword.value) {
    err.value = 'Mật khẩu xác nhận không khớp!'
    return
  }
  try {
    register({
      fullName: fullName.value,
      username: username.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
      password: password.value,
      avatar: ''
    })
    ok.value = 'Đăng ký thành công! Mời bạn đăng nhập.'
    setTimeout(() => router.push('/login'), 800)
  } catch (e) {
    err.value = e.message || 'Đăng ký thất bại'
  }
}
</script>
