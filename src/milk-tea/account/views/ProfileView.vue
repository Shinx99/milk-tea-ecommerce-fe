<script setup>
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { authState, updateProfile } from '@/milk-tea/account/store'

const editing = ref(false)

const form = ref({
  fullName: '',
  username: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  password: ''
})

function fillForm() {
  const u = authState.currentUser || {}
  form.value = {
    fullName: u.fullName || '',
    username: u.username || '',
    email: u.email || '',
    phone: u.phone || '',
    address: u.address || '',
    avatar: u.avatar || '',
    password: ''
  }
}
watch(() => authState.currentUser, fillForm, { immediate: true })

function onEdit() {
  editing.value = true
}
function onCancel() {
  editing.value = false
  fillForm()
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    form.value.avatar = ev.target.result // base64
  }
  reader.readAsDataURL(file)
}

async function onSave() {
  try {
    await updateProfile({
      fullName: form.value.fullName,
      address : form.value.address,
      avatar  : form.value.avatar,
      password: form.value.password || undefined
    })
    editing.value = false
    alert('Cập nhật hồ sơ thành công!')
  } catch (e) {
    alert(e?.message || 'Lỗi cập nhật hồ sơ')
  }
}
</script>

<template>
  <section class="container py-4">
    <h3 class="mb-4">Hồ sơ cá nhân</h3>

    <div v-if="authState.currentUser" class="card shadow-sm">
      <div class="card-body">
        <div class="row g-4 align-items-start">
          <div class="col-sm-3 text-center">
            <img
              :src="form.avatar || 'https://via.placeholder.com/120x120?text=Avatar'"
              class="rounded-circle border mb-3"
              style="width:120px;height:120px;object-fit:cover"
              alt="avatar"
            />

            <!-- Upload ảnh -->
            <div v-if="editing">
              <input type="file" class="form-control" accept="image/*" @change="onFileChange" />
            </div>
          </div>

          <div class="col-sm-9">
            <form @submit.prevent="onSave">
              <div class="mb-3">
                <label class="form-label">Họ và tên</label>
                <input v-model="form.fullName" class="form-control" :disabled="!editing" />
              </div>

              <div class="mb-3">
                <label class="form-label">Tên đăng nhập</label>
                <input v-model="form.username" class="form-control" disabled />
              </div>

              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="form.email" class="form-control" disabled />
              </div>

              <div class="mb-3">
                <label class="form-label">Số điện thoại</label>
                <input v-model="form.phone" class="form-control" disabled />
              </div>

              <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <textarea v-model="form.address" rows="2" class="form-control" :disabled="!editing"></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">Đổi mật khẩu</label>
                <input v-model="form.password" type="password" class="form-control" :disabled="!editing" placeholder="Nhập mật khẩu mới (để trống nếu không đổi)" />
              </div>

              <div class="d-flex gap-2">
                <button v-if="!editing" type="button" class="btn btn-warning" @click="onEdit">Chỉnh sửa</button>
                <button v-else type="submit" class="btn btn-success">Lưu</button>
                <button v-if="editing" type="button" class="btn btn-secondary" @click="onCancel">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning">
      Bạn chưa đăng nhập. <RouterLink to="/login">Đăng nhập ngay</RouterLink>
    </div>
  </section>
</template>
