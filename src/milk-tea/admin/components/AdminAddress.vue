<script setup>
import { ref, onMounted, watch, computed } from "vue";
// Import các Admin Address APIs THẬT
import {
  adminListByCustomer,
  adminCreateAddress,
  adminSetDefault,
  adminUpdateAddress,
  adminDeactivateAddress,
} from "@/milk-tea/account/service/Address.js";

// Import Customer Service Composables/State (Giữ nguyên)
import {
  customerState,
  loadCustomer,
  nextPage,
  prevPage,
} from "@/milk-tea/admin/composables/UseCustomer";

// --- START: CUSTOM HOOKS/STATE CHO TOAST VÀ POP-UP (GIỮ NGUYÊN) ---
const popupState = ref({
  isVisible: false,
  message: "",
  title: "",
  type: "info",
  isConfirm: false,
  resolve: null,
});
const toastMessage = ref(null);
const toastType = ref("success");
const showToastNotification = ref(false);
const isProcessing = ref(false);

function showAlertPopup(message, title = "Thông báo", type = "error") {
  popupState.value.title = title;
  popupState.value.message = message;
  popupState.value.type = type;
  popupState.value.isConfirm = false;
  popupState.value.isVisible = true;
}
function showConfirmPopup(message, title = "Xác nhận", type = "warning") {
  return new Promise((resolve) => {
    popupState.value.title = title;
    popupState.value.message = message;
    popupState.value.type = type;
    popupState.value.isConfirm = true;
    popupState.value.resolve = resolve;
    popupState.value.isVisible = true;
  });
}
function handlePopupClose(confirmed = false) {
  if (popupState.value.isConfirm && popupState.value.resolve) {
    popupState.value.resolve(confirmed);
  }
  popupState.value.isVisible = false;
  popupState.value.resolve = null;
}
function showToast(message, type = "success") {
  if (showToastNotification.value) {
    showToastNotification.value = false;
    setTimeout(() => {
      _showToastInternal(message, type);
    }, 50);
  } else {
    _showToastInternal(message, type);
  }
}
function _showToastInternal(message, type) {
  toastMessage.value = message;
  toastType.value = type;
  showToastNotification.value = true;
  setTimeout(() => {
    showToastNotification.value = false;
    toastMessage.value = null;
  }, 3000);
}
// --- END: CUSTOM HOOKS/STATE CHO TOAST VÀ POP-UP ---

// ... (Các logic khác giữ nguyên)

const addresses = ref([]);
const selectedCustomer = ref(null);
const selectedCustomerId = computed(() => selectedCustomer.value?.id);
const showViewAddressesModal = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const addressToEdit = ref({});
const loadingAddresses = ref(false);
const error = ref(null);
const form = ref({
  number: "",
  street: "",
  ward: "",
  district: "",
  city: "",
  isDefault: true,
});

async function fetchAddresses() {
  if (!selectedCustomerId.value) {
    addresses.value = [];
    return;
  }
  loadingAddresses.value = true;
  error.value = null;
  try {
    const res = await adminListByCustomer(selectedCustomerId.value);
    addresses.value = res.data.map((addr) => ({
      ...addr,
      number: addr.number || "",
      street: addr.street || "",
      ward: addr.ward || "",
      district: addr.district || "",
      city: addr.city || "",
      province: addr.province || "",
      country: addr.country || "",
    }));
    if (!addresses.value) addresses.value = [];
    showViewAddressesModal.value = true;
  } catch (e) {
    error.value = "Lỗi khi tải địa chỉ: " + e.message;
    console.error(e);
    showAlertPopup(
      "Lỗi khi tải địa chỉ: " + e.message,
      "Lỗi Hệ thống",
      "error"
    );
  } finally {
    loadingAddresses.value = false;
  }
}

function selectCustomer(customer) {
  selectedCustomer.value = customer;
  addresses.value = [];
  fetchAddresses();
}
function closeViewAddressesModal() {
  showViewAddressesModal.value = false;
  addresses.value = [];
}
async function setDefault(addressId) {
  if (isProcessing.value) return;
  if (
    !(await showConfirmPopup(
      "Bạn có chắc chắn muốn đặt địa chỉ này làm mặc định?"
    ))
  )
    return;
  isProcessing.value = true;
  try {
    await adminSetDefault(addressId);
    await fetchAddresses();
    showToast("Đặt mặc định thành công!", "success");
  } catch (e) {
    showAlertPopup("Lỗi khi đặt mặc định: " + e.message, "Lỗi", "error");
  } finally {
    isProcessing.value = false;
  }
}

async function createAddress() {
  if (isProcessing.value) return;
  if (!selectedCustomerId.value) {
    showAlertPopup(
      "Vui lòng chọn khách hàng trước khi thêm địa chỉ.",
      "Cảnh báo",
      "warning"
    );
    return;
  }
  isProcessing.value = true;
  try {
    await adminCreateAddress(selectedCustomerId.value, form.value);
    showAddModal.value = false;
    form.value = {
      number: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      isDefault: true,
    };
    await fetchAddresses();
    showToast("Thêm địa chỉ thành công!", "success");
  } catch (e) {
    showAlertPopup("Lỗi khi thêm địa chỉ: " + e.message, "Lỗi", "error");
  } finally {
    isProcessing.value = false;
  }
}

function openEditModal(address) {
  addressToEdit.value = {
    id: address.id,
    number: address.number,
    street: address.street,
    ward: address.ward,
    district: address.district,
    city: address.city,
    province: address.province || "",
    country: address.country || "",
    isDefault: address.isDefault,
  };
  showEditModal.value = true;
}

async function updateAddress() {
  if (isProcessing.value) return;
  if (!addressToEdit.value.id) return;
  if (!(await showConfirmPopup("Xác nhận cập nhật địa chỉ này?"))) return;
  isProcessing.value = true;
  try {
    await adminUpdateAddress(addressToEdit.value.id, addressToEdit.value);
    showEditModal.value = false;
    await fetchAddresses();
    showToast("Cập nhật địa chỉ thành công!", "success");
  } catch (e) {
    showAlertPopup("Lỗi khi cập nhật địa chỉ: " + e.message, "Lỗi", "error");
    console.error(e);
  } finally {
    isProcessing.value = false;
  }
}

async function deleteAddress(addressId) {
  if (isProcessing.value) return;
  if (
    !(await showConfirmPopup(
      "Xác nhận VÔ HIỆU HÓA địa chỉ này? (Địa chỉ không mặc định)",
      "Xác nhận Vô hiệu hóa"
    ))
  )
    return;
  const addr = addresses.value.find((a) => a.id === addressId);
  if (addr && addr.isDefault) {
    showAlertPopup(
      "Không thể vô hiệu hóa địa chỉ đang là MẶC ĐỊNH. Vui lòng đặt địa chỉ khác làm mặc định trước.",
      "Cảnh báo",
      "warning"
    );
    return;
  }
  isProcessing.value = true;
  try {
    await adminDeactivateAddress(addressId);
    await fetchAddresses();
    showToast("Vô hiệu hóa địa chỉ thành công!", "success");
  } catch (e) {
    showAlertPopup("Lỗi khi vô hiệu hóa địa chỉ: " + e.message, "Lỗi", "error");
  } finally {
    isProcessing.value = false;
  }
}

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
onMounted(async () => {
  await loadCustomer();
});

const goToNextPage = () => nextPage();
const goToPrevPage = () => prevPage();
const customers = computed(() => customerState.list);
</script>

<template>
  <div class="admin-address container mt-3">
    <h1 class="mb-4 fw-bolder text-primary">
      <i class="fa-solid fa-map-location-dot me-2"></i>
      Quản lý địa chỉ khách hàng
    </h1>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <transition name="toast-fade">
      <div
        v-if="showToastNotification"
        :class="['toast-notification', `bg-${toastType}`, `text-white`]"
      >
        <div class="d-flex align-items-center">
          <i
            :class="[
              'me-2 fa-fw',
              toastType === 'success'
                ? 'fa-solid fa-check-circle'
                : 'fa-solid fa-info-circle',
            ]"
          ></i>
          <strong class="me-auto">{{ toastMessage }}</strong>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="showToastNotification = false"
            :class="{ 'btn-close-white': toastType !== 'warning' }"
          ></button>
        </div>
      </div>
    </transition>

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
            aria-label="Tìm kiếm khách hàng theo tên, email, số điện thoại"
          />
        </div>
      </div>

      <div class="card-body p-0">
        <div class="table-responsive">
          <table
            class="table table-hover table-striped align-middle mb-0"
            role="table"
            aria-label="Danh sách khách hàng"
          >
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
                role="button"
                :aria-label="`Chọn khách hàng ${cus.fullname}`"
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
                  <button
                    class="btn btn-sm btn-outline-primary"
                    aria-label="Xem địa chỉ"
                  >
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
            <ul
              class="pagination mb-0 justify-content-center align-items-center"
            >
              <li
                class="page-item"
                :class="{ disabled: customerState.page === 0 }"
              >
                <button
                  @click="goToPrevPage"
                  :disabled="customerState.page === 0"
                  class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
                  aria-label="Trang trước"
                >
                  <span aria-hidden="true">&laquo; Trước</span>
                </button>
              </li>
              <li class="page-item disabled">
                <span
                  class="page-link text-dark fw-bold border-0 bg-transparent"
                  >Trang {{ customerState.page + 1 }} /
                  {{ customerState.totalPages }}</span
                >
              </li>
              <li
                class="page-item"
                :class="{
                  disabled: customerState.page >= customerState.totalPages - 1,
                }"
              >
                <button
                  @click="goToNextPage"
                  :disabled="customerState.page >= customerState.totalPages - 1"
                  class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
                  aria-label="Trang sau"
                >
                  <span aria-hidden="true">Sau &raquo;</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <transition name="modal-fade">
      <div
        v-if="popupState.isVisible"
        class="modal-overlay"
        style="z-index: 1060"
      >
        <div
          class="modal d-block bg-white p-4 rounded shadow-lg modal-sm"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="`popup-title`"
          style="z-index: 1070"
        >
          <div class="d-flex align-items-center mb-3">
            <i
              :class="[
                'me-3 fa-2x fa-fw',
                popupState.type === 'success'
                  ? 'fa-solid fa-check-circle text-success'
                  : popupState.type === 'error'
                  ? 'fa-solid fa-times-circle text-danger'
                  : popupState.type === 'warning'
                  ? 'fa-solid fa-exclamation-triangle text-warning'
                  : 'fa-solid fa-info-circle text-info',
              ]"
            ></i>
            <h5 id="popup-title" class="mb-0 text-dark">
              {{ popupState.title }}
            </h5>
          </div>
          <hr />
          <p class="mb-4">{{ popupState.message }}</p>

          <div class="d-flex justify-content-end">
            <button
              v-if="popupState.isConfirm"
              class="btn btn-secondary me-2"
              @click="handlePopupClose(false)"
              aria-label="Hủy thao tác"
            >
              Hủy
            </button>
            <button
              :class="[
                'btn',
                popupState.isConfirm ? 'btn-danger' : 'btn-success',
              ]"
              @click="handlePopupClose(true)"
              aria-label="Xác nhận"
            >
              {{ popupState.isConfirm ? "Xác nhận" : "OK" }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal-fade">
      <div v-if="showViewAddressesModal" class="modal-overlay">
        <div
          class="modal d-block bg-white p-4 rounded shadow-lg modal-lg"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`address-title-${selectedCustomer?.id}`"
        >
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4
              class="mb-0 text-primary"
              :id="`address-title-${selectedCustomer?.id}`"
            >
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
                aria-label="Thêm địa chỉ mới"
              >
                <i class="fa-solid fa-plus"></i> Thêm địa chỉ mới
              </button>
              <button
                class="btn btn-secondary btn-sm"
                @click="closeViewAddressesModal"
                aria-label="Đóng cửa sổ"
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
              <table
                class="table table-bordered table-hover align-middle mb-0"
                role="table"
                aria-label="Chi tiết địa chỉ của khách hàng"
              >
                <thead>
                  <tr class="table-primary">
                    <th style="width: 35%">Chi tiết Địa chỉ</th>
                    <th style="width: 25%">Khu vực</th>
                    <th class="text-center">Mặc định</th>
                    <th class="text-center">Trạng thái</th>
                    <th style="width: 250px">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="addr in addresses"
                    :key="addr.id"
                    :class="{ 'table-success': addr.isDefault }"
                  >
                    <td>
                      <span class="fw-bold"
                        >{{ addr.number }}, {{ addr.street }}</span
                      >
                      <br />
                      <span class="small text-muted">{{ addr.ward }}</span>
                    </td>
                    <td>
                      {{ addr.district }}<br />
                      <span class="small text-muted"
                        >{{ addr.city }}, {{ addr.province }}</span
                      >
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
                        class="badge"
                        :class="
                          addr.active
                            ? 'bg-success-subtle text-success'
                            : 'bg-danger-subtle text-danger'
                        "
                      >
                        {{ addr.active ? "Active" : "Inactive" }}
                      </span>
                    </td>
                    <td>
                      <div
                        class="btn-group"
                        role="group"
                        aria-label="Hành động địa chỉ"
                      >
                        <button
                          class="btn btn-sm btn-outline-info"
                          @click="openEditModal(addr)"
                          aria-label="Sửa địa chỉ"
                          title="Sửa chi tiết địa chỉ này"
                          :disabled="!addr.active"
                        >
                          <i class="fa-solid fa-edit"></i>
                        </button>
                        <button
                          class="btn btn-sm btn-outline-warning"
                          @click="setDefault(addr.id)"
                          :disabled="
                            addr.isDefault || !addr.active || isProcessing
                          "
                          :title="
                            !addr.active
                              ? 'Không thể đặt mặc định địa chỉ đã vô hiệu hóa'
                              : 'Đặt địa chỉ này làm mặc định'
                          "
                          aria-label="Đặt làm mặc định"
                        >
                          <i class="fa-solid fa-star"></i>
                        </button>
                        <button
                          class="btn btn-sm btn-outline-danger"
                          @click="deleteAddress(addr.id)"
                          :disabled="
                            !addr.active || addr.isDefault || isProcessing
                          "
                          :title="
                            addr.isDefault
                              ? 'Không thể vô hiệu hóa địa chỉ mặc định'
                              : addr.active
                              ? 'Vô hiệu hóa địa chỉ'
                              : 'Địa chỉ đã bị xóa'
                          "
                          aria-label="Vô hiệu hóa địa chỉ"
                        >
                          <i class="fa-solid fa-trash-alt"></i>
                        </button>
                      </div>
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
        <div
          class="modal d-block bg-white p-4 rounded shadow-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-title"
        >
          <h4 id="add-title">Thêm địa chỉ mới</h4>
          <hr />
          <div class="row">
            <div class="col-md-6 mb-2">
              <label>Số nhà:</label
              ><input
                v-model="form.number"
                class="form-control"
                placeholder="Số nhà"
              />
            </div>
            <div class="col-md-6 mb-2">
              <label>Đường:</label
              ><input
                v-model="form.street"
                class="form-control"
                placeholder="Đường"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-2">
              <label>Phường/Xã:</label
              ><input
                v-model="form.ward"
                class="form-control"
                placeholder="Phường/Xã"
              />
            </div>
            <div class="col-md-6 mb-2">
              <label>Quận/Huyện:</label
              ><input
                v-model="form.district"
                class="form-control"
                placeholder="Quận/Huyện"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-2">
              <label>Thành phố:</label
              ><input
                v-model="form.city"
                class="form-control"
                placeholder="Thành phố"
              />
            </div>
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
          <button
            class="btn btn-success me-2"
            @click="createAddress"
            :disabled="isProcessing"
            aria-label="Lưu địa chỉ mới"
          >
            <i v-if="isProcessing" class="fa-solid fa-spinner fa-spin me-1"></i>
            Thêm
          </button>
          <button
            class="btn btn-secondary"
            @click="showAddModal = false"
            aria-label="Hủy thao tác"
            :disabled="isProcessing"
          >
            Hủy
          </button>
        </div>
      </div>
    </transition>

    <transition name="modal-fade">
      <div v-if="showEditModal" class="modal-overlay">
        <div
          class="modal d-block bg-white p-4 rounded shadow-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-title"
        >
          <h4 id="edit-title">
            Sửa địa chỉ (ID:
            <span class="text-muted small">{{ addressToEdit.id }}</span
            >)
          </h4>
          <hr />
          <div class="row">
            <div class="col-md-6 mb-2">
              <label>Số nhà:</label
              ><input
                v-model="addressToEdit.number"
                class="form-control"
                placeholder="Số nhà"
              />
            </div>
            <div class="col-md-6 mb-2">
              <label>Đường:</label
              ><input
                v-model="addressToEdit.street"
                class="form-control"
                placeholder="Đường"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-2">
              <label>Phường/Xã:</label
              ><input
                v-model="addressToEdit.ward"
                class="form-control"
                placeholder="Phường/Xã"
              />
            </div>
            <div class="col-md-6 mb-2">
              <label>Quận/Huyện:</label
              ><input
                v-model="addressToEdit.district"
                class="form-control"
                placeholder="Quận/Huyện"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-2">
              <label>Thành phố:</label
              ><input
                v-model="addressToEdit.city"
                class="form-control"
                placeholder="Thành phố"
              />
            </div>
            <div class="col-md-6 mb-2">
              <label>Tỉnh/Thành phố:</label
              ><input
                v-model="addressToEdit.province"
                class="form-control"
                placeholder="Tỉnh/Thành phố"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label>Quốc gia:</label
              ><input
                v-model="addressToEdit.country"
                class="form-control"
                placeholder="Quốc gia"
              />
            </div>
          </div>

          <div class="form-check mb-3">
            <input
              type="checkbox"
              class="form-check-input"
              v-model="addressToEdit.isDefault"
              id="editDefaultCheck"
            />
            <label class="form-check-label fw-bold" for="editDefaultCheck"
              >Đặt làm Địa chỉ mặc định?</label
            >
          </div>

          <button
            class="btn btn-success me-2"
            @click="updateAddress"
            :disabled="isProcessing"
            aria-label="Lưu thay đổi địa chỉ"
          >
            <i v-if="isProcessing" class="fa-solid fa-spinner fa-spin me-1"></i>
            Lưu Thay Đổi
          </button>
          <button
            class="btn btn-secondary"
            @click="showEditModal = false"
            aria-label="Hủy chỉnh sửa"
            :disabled="isProcessing"
          >
            Hủy
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Thêm CSS cho Modal lớn hơn và form column */
.modal {
  /* Giá trị mặc định cho các modal View/Add/Edit */
  width: 400px;
  height: auto;
  max-height: 95vh;
}
.modal-lg {
  width: 900px !important; /* Tăng kích thước modal xem chi tiết */
  max-width: 95% !important;
}

/* FIX: Chỉnh kích thước Pop-up Alert/Confirm nhỏ gọn hơn và tự động chiều cao */
.modal-sm {
  width: 300px !important;
  max-width: 90% !important;
  height: auto;
  max-height: 50vh;
}

.table-success {
  font-weight: 500;
}
.cursor-pointer {
  cursor: pointer;
}

/* Group button cho Hành động */
.btn-group .btn {
  padding: 0.375rem 0.5rem; /* Giảm padding cho button trong group */
}
.btn-outline-info {
  color: var(--bs-info);
  border-color: var(--bs-info);
}
.btn-outline-info:hover {
  background-color: var(--bs-info);
  color: white;
}

/* ------------------------------------- */
/* CSS cho Modal */
/* ------------------------------------- */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040; /* Z-index cơ sở cho overlay (View/Add/Edit) */
}
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  /* Thuộc tính này đảm bảo modal được CĂN GIỮA MÀN HÌNH */
  transform: translate(-50%, -50%);
  z-index: 1050; /* Z-index cơ sở cho nội dung modal (View/Add/Edit) */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  overflow-y: auto; /* Thêm scroll nếu nội dung bị quá giới hạn chiều cao */
}

/* ------------------------------------- */
/* CSS cho Vue Transition (Giữ nguyên) */
/* ------------------------------------- */

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .modal,
.modal-fade-leave-active .modal {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.modal-fade-enter-from .modal,
.modal-fade-leave-to .modal {
  transform: translate(-50%, -60%);
  opacity: 0;
}

/* ------------------------------------- */
/* CSS MỚI cho Toast Notification */
/* ------------------------------------- */

.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1200; /* Đảm bảo Toast luôn nằm trên tất cả các Modal/Pop-up khác */
  padding: 1rem;
  border-radius: 0.5rem;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
}

/* Override màu Bootstrap cho Toast */
.bg-success {
  background-color: #28a745 !important;
}
.bg-error {
  background-color: #dc3545 !important;
}
.bg-warning {
  background-color: #ffc107 !important;
  color: #343a40 !important;
}
.bg-info {
  background-color: #17a2b8 !important;
}

.text-white {
  color: white !important;
}

/* Nút đóng màu trắng cho toast tối màu */
.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

/* CSS cho Vue Transition của Toast */
.toast-fade-enter-active {
  transition: all 0.5s ease-out;
}
.toast-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
