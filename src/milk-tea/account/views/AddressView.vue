<script setup>
import { ref, onMounted } from "vue";
import { useAddress } from "@/milk-tea/account/composables/address/UseAddress";
import { useUserStore } from "@/milk-tea/account/store";

const userStore = useUserStore();
const { addresses, loading, error, loadAddresses, create, update, remove } =
  useAddress();

const editing = ref(false);
const selected = ref(null);

const form = ref({
  id: null,
  number: "",
  street: "",
  ward: "",
  district: "",
  city: "",
  province: "",
  country: "",
  isDefault: false,
});

// -------------------
const resetForm = () => {
  form.value = {
    id: null,
    number: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    province: "",
    country: "",
    isDefault: false,
  };
};

// -------------------
const onSelect = (addr) => {
  if (editing.value) return;
  selected.value = addr.id;
  form.value = { ...addr };
  editing.value = true;
};

// -------------------
const onNew = () => {
  selected.value = null;
  resetForm();
  editing.value = true;
};

// -------------------
const onCancel = () => {
  editing.value = false;
  resetForm();
};

// -------------------
const onSave = async () => {
  const payload = { ...form.value };

  if (form.value.id == null) {
    // Create
    await create(payload);
  } else {
    // Update
    await update(form.value.id, payload);
  }

  editing.value = false;
  resetForm();
};

// -------------------
const onDelete = async (addr) => {
  if (!confirm("Xoá địa chỉ này?")) return;
  await remove(addr.id);
};

onMounted(loadAddresses);
</script>

<template>
  <section class="container py-4">
    <h3 class="mb-4">Địa chỉ giao hàng</h3>

    <div v-if="loading" class="alert alert-info">Đang tải...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Form -->
    <div v-if="editing" class="card p-3 mb-4 shadow-sm">
      <h5 class="mb-3">{{ form.id ? "Chỉnh sửa" : "Thêm mới" }} địa chỉ</h5>

      <div class="row g-2">
        <div class="col-md-3">
          <input
            v-model="form.number"
            class="form-control"
            placeholder="Số nhà"
          />
        </div>
        <div class="col-md-9">
          <input
            v-model="form.street"
            class="form-control"
            placeholder="Đường"
          />
        </div>
        <div class="col-md-4">
          <input
            v-model="form.ward"
            class="form-control"
            placeholder="Phường/Xã"
          />
        </div>
        <div class="col-md-4">
          <input
            v-model="form.district"
            class="form-control"
            placeholder="Quận/Huyện"
          />
        </div>
        <div class="col-md-4">
          <input
            v-model="form.city"
            class="form-control"
            placeholder="Thành phố"
          />
        </div>
        <!-- <div class="col-md-4">
          <input
            v-model="form.province"
            class="form-control"
            placeholder="Tỉnh"
          />
        </div>
        <div class="col-md-4">
          <input
            v-model="form.country"
            class="form-control"
            placeholder="Quốc gia"
          />
        </div> -->

        <div class="col-12 form-check mt-2">
          <input
            type="checkbox"
            v-model="form.isDefault"
            class="form-check-input"
          />
          <label class="form-check-label">Đặt làm mặc định</label>
        </div>
      </div>

      <div class="d-flex gap-2 mt-3">
        <button class="btn btn-success" @click="onSave">Lưu</button>
        <button class="btn btn-secondary" @click="onCancel">Hủy</button>
      </div>
    </div>

    <!-- Danh sách -->
    <div class="card p-3 shadow-sm">
      <div class="d-flex justify-content-between mb-3">
        <h5>Danh sách địa chỉ</h5>
        <button class="btn btn-primary btn-sm" v-if="!editing" @click="onNew">
          <i class="bi bi-plus-lg"></i> Thêm địa chỉ mới
        </button>
      </div>

      <div v-if="addresses.length === 0" class="text-muted text-center">
        Chưa có địa chỉ nào.
      </div>

      <div
        v-for="addr in addresses"
        :key="addr.id"
        class="p-3 border rounded mb-2"
        :class="{ 'border-primary': addr.id === selected }"
        style="cursor: pointer"
        @click="onSelect(addr)"
      >
        <strong>{{ addr.number }} {{ addr.street }}</strong
        >, {{ addr.ward }}, {{ addr.district }}, {{ addr.city }}
        <br />
        <small>
          {{
            [addr.province, addr.country]
              .map((v) => (v || "").trim())
              .filter((v) => v !== "")
              .join(", ")
          }}
        </small>

        <div class="mt-1">
          <span v-if="addr.isDefault" class="badge bg-primary">Mặc định</span>
          <span v-if="!addr.active" class="badge bg-secondary"
            >Không hoạt động</span
          >
        </div>

        <button
          class="btn btn-sm btn-outline-danger mt-2"
          @click.stop="onDelete(addr)"
        >
          Xóa
        </button>
      </div>
    </div>
  </section>
</template>
