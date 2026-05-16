<template>
  <section class="py-5" style="background-color:#f8f9fa;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body p-4 p-lg-5">
              <h3 class="text-center mb-4">Đăng ký</h3>

              <!-- Hiển thị lỗi tổng quát -->
              <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
              <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

              <!-- Hiển thị lỗi theo từng field -->
              <div v-if="fieldErrors.email" class="alert alert-danger small py-1 mb-2">
                <i class="fa-solid fa-circle-exclamation me-1"></i> {{ fieldErrors.email }}
              </div>

              <form @submit.prevent="onSubmit" novalidate>
                <div class="mb-3">
                  <label class="form-label">Họ và tên</label>
                  <input 
                    v-model.trim="fullName" 
                    type="text" 
                    class="form-control" 
                    :class="{ 'is-invalid': fieldErrors.fullname }"
                    placeholder="Nguyễn Văn A" 
                  />
                  <div v-if="fieldErrors.fullname" class="invalid-feedback">{{ fieldErrors.fullname }}</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input 
                    v-model.trim="email" 
                    type="email" 
                    class="form-control" 
                    :class="{ 'is-invalid': fieldErrors.email }"
                    placeholder="you@example.com" 
                  />
                  <div v-if="fieldErrors.email" class="invalid-feedback">{{ fieldErrors.email }}</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Số điện thoại</label>
                  <input 
                    v-model="phone" 
                    type="text" 
                    inputmode="numeric"
                    pattern="[0-9]*"
                    class="form-control" 
                    :class="{ 'is-invalid': fieldErrors.phone }"
                    placeholder="0987654321"
                    @input="validatePhoneNumber"
                    maxlength="10"
                  />
                  <div v-if="fieldErrors.phone" class="invalid-feedback">{{ fieldErrors.phone }}</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Mật khẩu</label>
                  <div class="input-group">
                    <input 
                      :type="showPass ? 'text' : 'password'" 
                      v-model="password" 
                      class="form-control" 
                      :class="{ 'is-invalid': fieldErrors.password }"
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary" 
                      @click="showPass=!showPass"
                    >
                      <i :class="showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                    </button>
                  </div>
                  <div v-if="fieldErrors.password" class="invalid-feedback d-block">{{ fieldErrors.password }}</div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Xác nhận mật khẩu</label>
                  <input 
                    :type="showPass ? 'text':'password'" 
                    v-model="confirmPassword" 
                    class="form-control" 
                    :class="{ 'is-invalid': fieldErrors.confirmPassword }"
                    placeholder="Nhập lại mật khẩu" 
                  />
                  <div v-if="fieldErrors.confirmPassword" class="invalid-feedback">{{ fieldErrors.confirmPassword }}</div>
                </div>

                <button class="btn btn-dark w-100 mb-3" type="submit" :disabled="isLoading">
                  <i v-if="isLoading" class="fa-solid fa-spinner fa-spin me-2"></i>
                  <i v-else class="fa-solid fa-user-plus me-2"></i>
                  {{ isLoading ? 'Đang xử lý...' : 'Đăng ký' }}
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/milk-tea/account/store' 

const userStore = useUserStore()
const router = useRouter()

// Form data
const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPass = ref(false)
const isLoading = ref(false)

// Error states
const errorMessage = ref('')
const successMessage = ref('')
const fieldErrors = reactive({
  email: '',
  password: '',
  fullname: '',
  phone: '',
  confirmPassword: ''
})

// Clear all errors
const clearErrors = () => {
  errorMessage.value = ''
  successMessage.value = ''
  fieldErrors.email = ''
  fieldErrors.password = ''
  fieldErrors.fullname = ''
  fieldErrors.phone = ''
  fieldErrors.confirmPassword = ''
}

// Client-side validation
const validateForm = () => {
  let isValid = true
  clearErrors()
  
  // Validate fullname
  if (!fullName.value.trim()) {
    fieldErrors.fullname = 'Vui lòng nhập họ tên'
    isValid = false
  } else if (fullName.value.trim().length < 2) {
    fieldErrors.fullname = 'Họ tên phải có ít nhất 2 ký tự'
    isValid = false
  }
  
  // Validate email
  if (!email.value.trim()) {
    fieldErrors.email = 'Vui lòng nhập email'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    fieldErrors.email = 'Email không đúng định dạng (ví dụ: ten@example.com)'
    isValid = false
  }
  
  // Validate phone
  if (!phone.value.trim()) {
    fieldErrors.phone = 'Vui lòng nhập số điện thoại'
    isValid = false
  } else if (!/^(0[0-9]{9})$/.test(phone.value)) {
    fieldErrors.phone = 'Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số'
    isValid = false
  }
  
  // Validate password
  if (!password.value) {
    fieldErrors.password = 'Vui lòng nhập mật khẩu'
    isValid = false
  } else if (password.value.length < 6) {
    fieldErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    isValid = false
  }
  
  // Validate confirm password
  if (password.value !== confirmPassword.value) {
    fieldErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    isValid = false
  }
  
  return isValid
}

const onSubmit = async () => {
  // Client-side validation trước
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  clearErrors()
  
  try {
    await userStore.register({
      email: email.value,
      password: password.value,
      phone: phone.value,
      fullname: fullName.value
    })
    
    successMessage.value = 'Đăng ký thành công! Mời bạn đăng nhập.'
    setTimeout(() => router.push('/login'), 1500)
    
  } catch (error) {
    console.error('Registration error:', error)
    
    // Xử lý các loại lỗi khác nhau
    const errorMsg = error.message || 'Đăng ký thất bại'
    
    // Phân tích lỗi để hiển thị đúng field
    if (errorMsg.toLowerCase().includes('email')) {
      fieldErrors.email = errorMsg
    } else if (errorMsg.toLowerCase().includes('password')) {
      fieldErrors.password = errorMsg
    } else if (errorMsg.toLowerCase().includes('phone')) {
      fieldErrors.phone = errorMsg
    } else if (errorMsg.toLowerCase().includes('fullname') || errorMsg.toLowerCase().includes('tên')) {
      fieldErrors.fullname = errorMsg
    } else {
      errorMessage.value = errorMsg
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545;
}
.invalid-feedback {
  display: block;
}
</style>