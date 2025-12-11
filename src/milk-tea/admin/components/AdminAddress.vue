<script setup>
import { ref, onMounted, watch, computed } from "vue";
// Import Admin Address APIs
import {
  adminListByCustomer,
  adminCreateAddress,
  adminSetDefault,
} from "@/milk-tea/account/service/Address.js";

// Import Customer Service Composables/State
import {
  customerState,
  loadCustomer,
  nextPage,
  prevPage,
} from "@/milk-tea/admin/composables/UseCustomer";

// Danh sách địa chỉ
const addresses = ref([]);

// State cho khách hàng được chọn
const selectedCustomer = ref(null); // Lưu trữ toàn bộ đối tượng Customer
const selectedCustomerId = computed(() => selectedCustomer.value?.id); // ID để gọi API

// *** STATE CHO MODAL XEM DANH SÁCH ĐỊA CHỈ ***
const showViewAddressesModal = ref(false);
// Modal thêm địa chỉ (Giữ nguyên)
const showAddModal = ref(false);

// Trạng thái tải riêng cho Bảng Địa chỉ
const loadingAddresses = ref(false);
const error = ref(null);

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
  if (!selectedCustomerId.value) {
    addresses.value = [];
    return;
  }
  loadingAddresses.value = true;
  error.value = null;

  try {
    const res = await adminListByCustomer(selectedCustomerId.value);
    addresses.value = res.data;
    if (!addresses.value) addresses.value = [];

    // MỞ MODAL XEM DANH SÁCH SAU KHI TẢI THÀNH CÔNG
    showViewAddressesModal.value = true;
  } catch (e) {
    error.value = "Lỗi khi tải địa chỉ: " + e.message;
    console.error(e);
  } finally {
    loadingAddresses.value = false;
  }
}

// Kích hoạt khi Admin click vào khách hàng trên bảng
function selectCustomer(customer) {
  selectedCustomer.value = customer;
  addresses.value = [];
  fetchAddresses();
}

// Đóng Modal Xem Danh sách Địa chỉ
function closeViewAddressesModal() {
  showViewAddressesModal.value = false;
  addresses.value = [];
}

// Set default address
async function setDefault(addressId) {
  if (!confirm("Xác nhận đặt địa chỉ này làm mặc định?")) return;

  try {
    await adminSetDefault(addressId);
    await fetchAddresses();
    alert("Đặt mặc định thành công!");
  } catch (e) {
    alert("Lỗi khi đặt mặc định: " + e.message);
  }
}

// Thêm địa chỉ mới
async function createAddress() {
  if (!selectedCustomerId.value) {
    alert("Vui lòng chọn khách hàng trước.");
    return;
  }
  try {
    // Thêm địa chỉ
    await adminCreateAddress(selectedCustomerId.value, form.value);

    // Đóng Modal Thêm và reset form
    showAddModal.value = false;
    form.value = {
      number: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      isDefault: true,
    };

    // Tải lại danh sách địa chỉ (sẽ cập nhật trong Modal đang mở)
    await fetchAddresses();

    alert("Thêm địa chỉ thành công!");
  } catch (e) {
    alert("Lỗi khi thêm địa chỉ: " + e.message);
  }
}

// Theo dõi thay đổi của keyword trong customerState để search realtime
watch(
  () => customerState.keyword,
  (newVal) => {
    if (customerState.searchTimeout) {
      clearTimeout(customerState.searchTimeout);
    }
    customerState.searchTimeout = setTimeout(() => {
      customerState.page = 0;
      loadCustomer();
    }, 300);
  }
);

// Load danh sách khách hàng ban đầu
onMounted(async () => {
  await loadCustomer();
});

// Expose ra các hàm paging
const goToNextPage = () => nextPage();
const goToPrevPage = () => prevPage();
const customers = computed(() => customerState.list); // Danh sách khách hàng từ state
</script>

<template>
  <div class="admin-address container mt-3">
    <h3 class="mb-4 fw-bolder text-primary">
      <i class="fa-solid fa-map-location-dot me-2"></i>
      Quản lý địa chỉ khách hàng
    </h3>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="card shadow-sm mb-4">
      <div
        class="card-header bg-white d-flex justify-content-between align-items-center"
      >
        <h5 class="mb-0">Tìm kiếm Khách hàng</h5>
        <div style="max-width: 350px; width: 100%">
          <input
            v-model="customerState.keyword"
            type="search"
            class="form-control"
            placeholder="Tìm theo Tên, Email, SĐT..."
          />
        </div>
      </div>

      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover table-striped align-middle mb-0">
            <thead class="table-info">
              <tr>
                <th scope="col" class="text-nowrap">ID Khách hàng</th>
                <th scope="col">Họ và Tên</th>
                <th scope="col">Email</th>
                <th scope="col" class="text-center">Trạng Thái</th>
                <th scope="col" class="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="customerState.isLoading">
                <td colspan="5" class="text-center text-info py-3">
                  Đang tải danh sách khách hàng...
                </td>
              </tr>
              <tr
                v-else
                v-for="cus in customers"
                :key="cus.id"
                @click="selectCustomer(cus)"
                class="cursor-pointer"
                :class="{ 'table-primary': selectedCustomer?.id === cus.id }"
              >
                <td class="small text-muted">{{ cus.id }}</td>
                <td class="fw-bold">{{ cus.fullname }}</td>
                <td>{{ cus.email }}</td>
                <td class="text-center">
                  <span
                    class="badge"
                    :class="cus.active ? 'bg-success' : 'bg-danger'"
                  >
                    {{ cus.active ? "Hoạt Động" : "Ẩn" }}
                  </span>
                </td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="fa-solid fa-map-marker-alt"></i> Chọn
                  </button>
                </td>
              </tr>
              <tr v-if="!customerState.isLoading && customers.length === 0">
                <td colspan="5" class="text-center text-muted py-3">
                  Không tìm thấy khách hàng nào.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card-footer bg-white p-3">
          <div class="d-flex justify-content-center">
            <button
              @click="goToPrevPage"
              :disabled="customerState.page === 0"
              class="btn btn-sm btn-outline-secondary me-2"
            >
              Trước
            </button>
            <span class="text-muted small align-self-center"
              >Trang {{ customerState.page + 1 }} /
              {{ customerState.totalPages }}</span
            >
            <button
              @click="goToNextPage"
              :disabled="customerState.page >= customerState.totalPages - 1"
              class="btn btn-sm btn-outline-secondary ms-2"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <transition name="modal-fade">
      <div v-if="showViewAddressesModal" class="modal-overlay">
        <div class="modal d-block bg-white p-4 rounded shadow-lg modal-lg">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0 text-primary">
              Địa chỉ của:
              <span class="text-warning fw-bold">{{
                selectedCustomer?.fullname
              }}</span>
            </h4>
            <div>
              <button
                class="btn btn-warning btn-sm me-2"
                @click="showAddModal = true"
                :disabled="!selectedCustomer"
              >
                <i class="fa-solid fa-plus"></i> Thêm địa chỉ mới
              </button>
              <button
                class="btn btn-secondary btn-sm"
                @click="closeViewAddressesModal"
              >
                <i class="fa-solid fa-times"></i> Đóng
              </button>
            </div>
          </div>
          <hr />

          <div v-if="loadingAddresses" class="p-3 text-info text-center">
            <i class="fa-solid fa-spinner fa-spin me-2"></i> Đang tải địa chỉ
            chi tiết...
          </div>
          <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

          <div v-else-if="addresses.length">
            <div class="table-responsive">
              <table class="table table-bordered table-hover align-middle mb-0">
                <thead>
                  <tr class="table-primary">
                    <th>Địa chỉ</th>
                    <th class="text-center">Mặc định</th>
                    <th class="text-center">Trạng thái</th>
                    <th style="width: 200px">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="addr in addresses"
                    :key="addr.id"
                    :class="{ 'table-success': addr.isDefault }"
                  >
                    <td>
                      {{ addr.number }}, {{ addr.street }}, {{ addr.ward }},
                      {{ addr.district }}, {{ addr.city }}, {{ addr.province }},
                      {{ addr.country }}
                    </td>
                    <td class="text-center">
                      <span
                        class="badge"
                        :class="addr.isDefault ? 'bg-success' : 'bg-secondary'"
                      >
                        {{ addr.isDefault ? "YES" : "NO" }}
                      </span>
                    </td>
                    <td class="text-center">
                      <span
                        :class="addr.active ? 'text-success' : 'text-danger'"
                      >
                        {{ addr.active ? "Active" : "Inactive" }}
                      </span>
                    </td>
                    <td>
                      <button
                        class="btn btn-sm btn-warning me-2"
                        @click="setDefault(addr.id)"
                        :disabled="addr.isDefault"
                      >
                        <i class="fa-solid fa-star"></i> Mặc định
                      </button>
                      <button class="btn btn-sm btn-danger">
                        <i class="fa-solid fa-trash"></i> Xóa
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="alert alert-info mb-0 text-center">
            Khách hàng này chưa có địa chỉ nào được lưu.
          </div>
        </div>
      </div>
    </transition>
    <transition name="modal-fade">
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal d-block bg-white p-4 rounded shadow-lg">
          <h4>Thêm địa chỉ mới</h4>
          <hr />
          <div class="mb-2">
            <label>Số nhà:</label>
            <input
              v-model="form.number"
              class="form-control"
              placeholder="Số nhà"
            />
          </div>
          <div class="mb-2">
            <label>Đường:</label>
            <input
              v-model="form.street"
              class="form-control"
              placeholder="Đường"
            />
          </div>
          <div class="mb-2">
            <label>Phường/Xã:</label>
            <input
              v-model="form.ward"
              class="form-control"
              placeholder="Phường/Xã"
            />
          </div>
          <div class="mb-2">
            <label>Quận/Huyện:</label>
            <input
              v-model="form.district"
              class="form-control"
              placeholder="Quận/Huyện"
            />
          </div>
          <div class="mb-2">
            <label>Thành phố:</label>
            <input
              v-model="form.city"
              class="form-control"
              placeholder="Thành phố"
            />
          </div>
          <div class="form-check mb-3">
            <input
              type="checkbox"
              class="form-check-input"
              v-model="form.isDefault"
              id="defaultCheck"
            />
            <label class="form-check-label fw-bold" for="defaultCheck"
              >Đặt làm Địa chỉ mặc định?</label
            >
          </div>
          <button class="btn btn-success me-2" @click="createAddress">
            Thêm
          </button>
          <button class="btn btn-secondary" @click="showAddModal = false">
            Hủy
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Thêm style để modal overlay lên toàn màn hình */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Lớp phủ mờ */
  z-index: 1040;
}
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px; /* Kích thước mặc định cho Modal nhỏ (thêm địa chỉ) */
  z-index: 1050;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}
/* Kích thước lớn hơn cho Modal Xem Danh sách Địa chỉ */
.modal-lg {
  width: 800px;
  max-width: 90%;
}
.table-success {
  font-weight: 500;
}
.cursor-pointer {
  cursor: pointer;
}

/* ------------------------------------- */
/* CSS cho Vue Transition (Hiệu ứng mượt mà) */
/* ------------------------------------- */

/* Áp dụng transition cho lớp phủ */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

/* Ẩn lớp phủ khi vào/ra */
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Thêm hiệu ứng trượt nhẹ cho nội dung Modal (phần .modal) */
.modal-fade-enter-active .modal,
.modal-fade-leave-active .modal {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Ẩn và đưa nội dung Modal lên cao hơn một chút khi bắt đầu/kết thúc */
.modal-fade-enter-from .modal,
.modal-fade-leave-to .modal {
  transform: translate(-50%, -60%);
  opacity: 0;
}
</style>
