<script setup>
import { ref, watch, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useProfile } from "@/milk-tea/account/composables/customer/UseProfile";
import { useUserStore } from "@/milk-tea/account/store";

const { profile, loading, error, loadProfile, updateProfile } = useProfile();
const userStore = useUserStore();

const editing = ref(false);
const selectedAddressIdx = ref(0);

const form = ref({
  fullname: "",
  phone: "",
  email: "",
  address: {},
});

const addressList = ref([]);

// Load thông tin khi mount
onMounted(() => {
  const userId = userStore.userInfo?.userId;
  if (userId) loadProfile(userId);
});

// Đồng bộ từ profile -> form và danh sách địa chỉ
watch(profile, (newProfile) => {
  if (newProfile) {
    form.value.fullname = newProfile.fullname || "";
    form.value.phone = newProfile.phone || "";
    form.value.email = newProfile.email || "";
    addressList.value = Array.isArray(newProfile.addresses)
      ? newProfile.addresses
      : [];
    setAddressForm(0);
  }
});

// Hàm set địa chỉ đang edit
function setAddressForm(idx) {
  selectedAddressIdx.value = idx;
  form.value.address = { ...addressList.value[idx] };
  editing.value = true;
}

function onNewAddress() {
  editing.value = true;
  form.value.address = {
    id: null,
    number: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    province: "",
    country: "",
    isDefault: false,
    active: true,
  };
  selectedAddressIdx.value = -1;
}

// Hủy
function onCancel() {
  editing.value = false;
  if (selectedAddressIdx.value >= 0) setAddressForm(selectedAddressIdx.value);
}

// Xóa mềm địa chỉ
async function onDeleteAddress(idx) {
  if (!confirm("Bạn có chắc muốn xóa địa chỉ này không?")) return;
  let newAddresses = [...addressList.value];
  newAddresses[idx] = {
    ...newAddresses[idx],
    active: false,
  };

  const payload = {
    fullname: form.value.fullname,
    phone: form.value.phone,
    email: form.value.email,
    addresses: newAddresses,
  };

  try {
    const userId = userStore.userInfo?.userId;
    if (!userId) {
      alert("Không tìm thấy người dùng để cập nhật.");
      return;
    }
    await updateProfile(userId, payload);
    addressList.value = newAddresses;
    if (selectedAddressIdx.value === idx) {
      selectedAddressIdx.value = -1;
      form.value.address = {};
      editing.value = false;
    }
    alert("Xóa địa chỉ thành công!");
  } catch (e) {
    alert(e?.message || "Lỗi khi xóa địa chỉ");
  }
}

// Lưu
async function onSave() {
  try {
    const userId = userStore.userInfo?.userId;
    if (!userId) {
      alert("Không tìm thấy người dùng để cập nhật.");
      return;
    }
    let newAddresses = [...addressList.value];
    if (selectedAddressIdx.value === -1) {
      newAddresses.push({ ...form.value.address });
    } else {
      newAddresses[selectedAddressIdx.value] = { ...form.value.address };
    }
    const payload = {
      fullname: form.value.fullname,
      phone: form.value.phone,
      email: form.value.email,
      addresses: newAddresses,
    };
    await updateProfile(userId, payload);
    editing.value = false;
    alert("Cập nhật hồ sơ thành công!");
  } catch (e) {
    alert(e?.message || "Lỗi cập nhật hồ sơ");
  }
}
</script>

<template>
  <section class="container py-4">
    <h3 class="mb-4">Thông tin & Địa chỉ khách hàng</h3>
    <div v-if="loading" class="alert alert-info">Đang tải...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="profile && !loading" class="row">
      <!-- INPUT FORM (TRÁI) -->
      <div class="col-md-7">
        <div class="card shadow-sm mb-2">
          <div class="card-body">
            <form @submit.prevent="onSave">
              <h5 class="mb-3">Thông tin cá nhân</h5>
              <div class="mb-3">
                <label class="form-label">Họ và tên</label>
                <input
                  v-model="form.fullname"
                  class="form-control"
                  maxlength="255"
                  :disabled="!editing"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Số điện thoại</label>
                <input
                  v-model="form.phone"
                  class="form-control"
                  maxlength="40"
                  :disabled="!editing"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="form.email" class="form-control" disabled />
              </div>
              <h5 class="mt-4 mb-2">Địa chỉ chi tiết</h5>
              <div class="mb-3">
                <input
                  v-model="form.address.number"
                  class="form-control"
                  :disabled="!editing"
                  placeholder="Số nhà"
                  maxlength="50"
                />
              </div>
              <div class="mb-3">
                <input
                  v-model="form.address.street"
                  class="form-control"
                  :disabled="!editing"
                  placeholder="Đường"
                  maxlength="100"
                />
              </div>
              <div class="mb-3">
                <input
                  v-model="form.address.ward"
                  class="form-control"
                  :disabled="!editing"
                  placeholder="Phường/Xã"
                  maxlength="100"
                />
              </div>
              <div class="mb-3">
                <input
                  v-model="form.address.district"
                  class="form-control"
                  :disabled="!editing"
                  placeholder="Quận/Huyện"
                  maxlength="100"
                />
              </div>
              <div class="mb-3">
                <input
                  v-model="form.address.city"
                  class="form-control"
                  :disabled="!editing"
                  placeholder="Thành phố"
                  maxlength="100"
                />
              </div>
              <div class="mb-3">
                <input
                  v-model="form.address.province"
                  class="form-control"
                  :disabled="!editing"
                  placeholder="Tỉnh/Bang"
                  maxlength="100"
                />
              </div>
              <div class="mb-3">
                <input
                  v-model="form.address.country"
                  class="form-control"
                  :disabled="!editing"
                  placeholder="Quốc gia"
                  maxlength="100"
                />
              </div>
              <div class="mb-3">
                <span class="me-2"
                  >Mặc định
                  <input
                    type="checkbox"
                    v-model="form.address.isDefault"
                    :disabled="!editing"
                /></span>
              </div>
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
        <button
          v-if="!editing"
          @click="onNewAddress"
          class="btn btn-primary mt-2"
        >
          Thêm địa chỉ mới
        </button>
      </div>

      <!-- DANH SÁCH ĐỊA CHỈ (PHẢI) -->
      <div class="col-md-5">
        <div class="list-group">
          <h5 class="ms-2 mb-2">Danh sách địa chỉ</h5>
          <template v-if="addressList.length">
            <button
              v-for="(addr, idx) in addressList"
              :key="addr.id"
              class="list-group-item list-group-item-action my-1 d-flex justify-content-between align-items-center"
              :class="{ active: idx === selectedAddressIdx }"
              :disabled="editing"
            >
              <span
                @click="setAddressForm(idx)"
                style="cursor: pointer; flex-grow: 1"
              >
                {{ addr.number }} {{ addr.street }}, {{ addr.ward }},
                {{ addr.district }}, {{ addr.city }}
                <span v-if="addr.isDefault" class="badge bg-primary ms-2"
                  >Mặc định</span
                >
                <span v-if="!addr.active" class="badge bg-secondary ms-2"
                  >Không SD</span
                >
              </span>
              <button
                type="button"
                @click.stop="onDeleteAddress(idx)"
                class="btn btn-sm btn-danger"
                :disabled="editing"
              >
                Xóa
              </button>
            </button>
          </template>
          <div v-else class="list-group-item text-muted">
            Chưa có địa chỉ nào.
          </div>
        </div>
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
