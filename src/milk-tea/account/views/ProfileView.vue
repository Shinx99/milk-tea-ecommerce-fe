<script setup>
import { ref, watch, onMounted } from "vue";
import { RouterLink } from "vue-router";
// 1. Import composable mới
import { useProfile } from "@/milk-tea/account/composables/customer/UseProfile";
// Vẫn cần UserStore chỉ để lấy ID người dùng hiện tại
import { useUserStore } from "@/milk-tea/account/store";

// 2. Sử dụng composable mới
const { profile, loading, error, loadProfile, updateProfile } = useProfile();
const userStore = useUserStore();

const editing = ref(false);
const form = ref({});

// 3. Tải dữ liệu khi component được tạo
onMounted(() => {
  const userId = userStore.userInfo?.userId;
  if (userId) {
    loadProfile(userId);
  }
});

// 4. Đồng bộ form với dữ liệu từ composable
watch(profile, (newProfile) => {
  if (newProfile) {
    form.value = {
      fullName: newProfile.fullname || "",
      email: newProfile.email || "",
      phone: newProfile.phone || "",
    };
  }
});

function onEdit() {
  editing.value = true;
}
function onCancel() {
  editing.value = false;
  // Reset form về dữ liệu gốc từ `profile`
  if (profile.value) {
    form.value.fullName = profile.value.fullname;
  }
}

// 5. Hàm onSave gọi đến composable mới
async function onSave() {
  try {
    const userId = userStore.userInfo?.userId;
    if (!userId) {
      alert("Không tìm thấy người dùng để cập nhật.");
      return;
    }

    const payload = {
      fullname: form.value.fullName,
    };

    await updateProfile(userId, payload); // Gọi hàm từ composable

    editing.value = false;
    alert("Cập nhật hồ sơ thành công!");
  } catch (e) {
    alert(e?.message || "Lỗi cập nhật hồ sơ");
  }
}
</script>

<template>
  <section class="container py-4">
    <h3 class="mb-4">Hồ sơ cá nhân</h3>

    <!-- 1. Hiển thị spinner KHI ĐANG loading -->
    <div v-if="loading" class="alert alert-info">Đang tải...</div>

    <!-- 2. Hiển thị lỗi NẾU CÓ lỗi -->
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="profile && !loading" class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="onSave">
          <!-- Các ô input của bạn -->
          <div class="mb-3">
            <label class="form-label">Họ và tên</label>
            <input
              v-model="form.fullName"
              class="form-control"
              :disabled="!editing"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="form.email" class="form-control" disabled />
          </div>
          <div class="mb-3">
            <label class="form-label">Số điện thoại</label>
            <input
              v-model="form.phone"
              class="form-control"
              :disabled="!editing"
            />
          </div>

          <!-- Các nút -->
          <div class="d-flex gap-2">
            <button
              v-if="!editing"
              @click="onEdit"
              type="button"
              class="btn btn-warning"
            >
              Chỉnh sửa
            </button>
            <button
              v-else
              type="submit"
              class="btn btn-success"
              :disabled="loading"
            >
              Lưu
            </button>
            <button
              v-if="editing"
              @click="onCancel"
              type="button"
              class="btn btn-secondary"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-else-if="!userStore.userInfo && !loading"
      class="alert alert-warning"
    >
      Bạn chưa đăng nhập. <RouterLink to="/login">Đăng nhập ngay</RouterLink>
    </div>
  </section>
</template>
