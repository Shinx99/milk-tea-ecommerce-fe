<script setup>
import { ref, onMounted } from "vue";
import {
  adminListByCustomer,
  adminCreateAddress,
  adminSetDefault,
} from "@/milk-tea/account/service/Address";

// Danh sách địa chỉ
const addresses = ref([]);

// Danh sách khách hàng (Admin lấy)
const customers = ref([]);
const selectedCustomerId = ref(null);

// Modal thêm địa chỉ
const showAddModal = ref(false);

// Form thêm địa chỉ
const form = ref({
  number: "",
  street: "",
  ward: "",
  district: "",
  city: "",
  isDefault: true,
});

// Lấy danh sách địa chỉ theo customerId
async function fetchAddresses() {
  if (!selectedCustomerId.value) return;
  const res = await adminListByCustomer(selectedCustomerId.value);
  addresses.value = res.data.data;
}

// Set default address
async function setDefault(addressId) {
  await adminSetDefault(addressId);
  fetchAddresses();
}

// Thêm địa chỉ mới
async function createAddress() {
  await adminCreateAddress(selectedCustomerId.value, form.value);
  fetchAddresses();
  showAddModal.value = false;
  // reset form
  form.value = {
    number: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    isDefault: true,
  };
}

// Load danh sách khách hàng khi mounted
onMounted(async () => {
  const res = await fetch("/api/customers"); // Admin Customer API
  const data = await res.json();
  customers.value = data.data.content;
  if (customers.value.length) selectedCustomerId.value = customers.value[0].id;
  fetchAddresses();
});
</script>

<template>
  <div class="admin-address container mt-3">
    <h3 class="mb-3">Quản lý địa chỉ khách hàng</h3>

    <!-- Chọn khách hàng -->
    <div class="mb-3">
      <label for="customerSelect">Chọn khách hàng:</label>
      <select
        id="customerSelect"
        v-model="selectedCustomerId"
        @change="fetchAddresses"
        class="form-select w-auto"
      >
        <option v-for="c in customers" :key="c.id" :value="c.id">
          {{ c.fullname }}
        </option>
      </select>
      <button class="btn btn-primary ms-2" @click="showAddModal = true">
        Thêm địa chỉ
      </button>
    </div>

    <!-- Bảng danh sách địa chỉ -->
    <table class="table table-bordered table-hover">
      <thead>
        <tr>
          <th>Địa chỉ</th>
          <th>Mặc định</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="addr in addresses" :key="addr.id">
          <td>
            {{ addr.number }}, {{ addr.street }}, {{ addr.ward }},
            {{ addr.district }}, {{ addr.city }}
          </td>
          <td>{{ addr.isDefault ? "Yes" : "No" }}</td>
          <td>{{ addr.active ? "Active" : "Inactive" }}</td>
          <td>
            <button
              class="btn btn-sm btn-warning"
              @click="setDefault(addr.id)"
              :disabled="addr.isDefault"
            >
              Set Default
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Thêm địa chỉ -->
    <div v-if="showAddModal" class="modal d-block bg-light p-3 rounded">
      <h4>Thêm địa chỉ</h4>
      <div class="mb-2">
        <input
          v-model="form.number"
          class="form-control"
          placeholder="Số nhà"
        />
      </div>
      <div class="mb-2">
        <input v-model="form.street" class="form-control" placeholder="Đường" />
      </div>
      <div class="mb-2">
        <input v-model="form.ward" class="form-control" placeholder="Phường" />
      </div>
      <div class="mb-2">
        <input
          v-model="form.district"
          class="form-control"
          placeholder="Quận"
        />
      </div>
      <div class="mb-2">
        <input
          v-model="form.city"
          class="form-control"
          placeholder="Thành phố"
        />
      </div>
      <div class="form-check mb-2">
        <input
          type="checkbox"
          class="form-check-input"
          v-model="form.isDefault"
          id="defaultCheck"
        />
        <label class="form-check-label" for="defaultCheck"
          >Địa chỉ mặc định</label
        >
      </div>
      <button class="btn btn-success me-2" @click="createAddress">Thêm</button>
      <button class="btn btn-secondary" @click="showAddModal = false">
        Hủy
      </button>
    </div>
  </div>
</template>

<style scoped>
.admin-address h3 {
  font-weight: 600;
  color: #333;
}
.table th,
.table td {
  vertical-align: middle;
}
.modal {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  z-index: 1050;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}
</style>
