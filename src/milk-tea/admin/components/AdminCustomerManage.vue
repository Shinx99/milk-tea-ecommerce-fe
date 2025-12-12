<script setup>
import { ref, onMounted, computed, watch } from "vue";
import * as bootstrap from "bootstrap";

// Import router
import { useRouter } from "vue-router";
const router = useRouter();

// import tu composables (UseCustomer.js)
import {
  customerState,
  loadCustomer,
  updateCustomer,
  nextPage,
  prevPage,
  deleteCustomer,
} from "../composables/UseCustomer.js";

// --- START: CUSTOM HOOKS/STATE CHO TOAST VÀ POP-UP (ĐỒNG BỘ) ---

const popupState = ref({
  isVisible: false,
  message: "",
  title: "",
  type: "info",
  isConfirm: false,
  resolve: null,
});

// Toast State
const toastMessage = ref(null);
const toastType = ref("success");
const showToastNotification = ref(false);

const isProcessing = ref(false); // Dùng cho trạng thái loading/submit

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

//customer <<--- customerState.list
const customers = computed(() => customerState.list);

// Bien new Customer
const newCustomer = ref({
  fullname: "",
  email: "",
  phone: "",
  active: true,
});

// Dang Edit customerId nao? Null ? Create : Update
const edittingId = ref(null);

// Load trang ngay sau khi mo
onMounted(async () => {
  await loadCustomer();
});

// Trang them nguoi dung --> dang ky (GIỮ NGUYÊN)
function goToRegister() {
  router.push("/register"); // dùng path tuyệt đối
}

// Phuc vu cho realtime search
customerState.searchTimeout = null;

// Watch keyword để search realtime
watch(
  () => customerState.keyword,
  (newVal) => {
    // xoá timer cũ
    if (customerState.searchTimeout) {
      clearTimeout(customerState.searchTimeout);
    }

    // đợi 100ms sau khi ngừng gõ rồi mới gọi API
    customerState.searchTimeout = setTimeout(() => {
      customerState.page = 0; // luôn quay về trang đầu khi search mới
      loadCustomer();
    }, 100);
  }
);

function startEdit(cus) {
  edittingId.value = cus.id;
  newCustomer.value = {
    fullname: cus.fullname,
    email: cus.email,
    phone: cus.phone,
    active: cus.active,
  };
  openModal();
}

//Method Handle Submit (Lưu/Cập nhật)
async function handleSubmit() {
  isProcessing.value = true; // Bật loading
  try {
    const payload = { ...newCustomer.value };

    if (edittingId.value) {
      await updateCustomer(edittingId.value, payload);
      showToast("Cập nhật khách hàng thành công!", "success"); // THAY ALERT
    } else {
      showAlertPopup(
        "Hệ thống đang bảo trì! Không thể thêm mới.",
        "Cảnh báo",
        "warning"
      ); // THAY ALERT
    }
    await loadCustomer();
    resetForm();
    closeModal();
  } catch (error) {
    showAlertPopup(
      "Lưu khách hàng thất bại: " + (customerState.error || error.message),
      "Lỗi Lưu",
      "error"
    ); // THAY ALERT
  } finally {
    isProcessing.value = false; // Tắt loading
  }
}

function openModal() {
  const modalEl = document.getElementById("exampleModal");
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

function closeModal() {
  const modalEl = document.getElementById("exampleModal");
  if (!modalEl) return;

  const modal =
    bootstrap.Modal.getInstance(modalEl) ||
    bootstrap.Modal.getOrCreateInstance(modalEl);

  modal.hide();

  // Cleanup backdrop
  document.body.classList.remove("modal-open");
  document.body.style.removeProperty("padding-right");
  document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
}

function resetForm() {
  edittingId.value = null;
  newCustomer.value = {
    fullname: "",
    email: "",
    phone: "",
    active: true,
  };
}

//Delete (Xóa)
async function removeCustomer(id) {
  if (isProcessing.value) return;

  if (
    !(await showConfirmPopup(
      "Bạn có chắc chắn muốn xóa khách hàng này?",
      "Xác nhận xóa",
      "warning"
    ))
  )
    return; // THAY CONFIRM

  isProcessing.value = true;
  showToast("Đang xử lý xóa...", "info"); // THÔNG BÁO ĐANG XỬ LÝ

  try {
    await deleteCustomer(id);
    showToast("Xóa khách hàng thành công!", "success"); // THAY ALERT
    await loadCustomer();
  } catch (e) {
    showAlertPopup("Xóa thất bại: " + customerState.error, "Lỗi Xóa", "error"); // THAY ALERT
  } finally {
    isProcessing.value = false;
  }
}

//Format createdAt va updatedAt theo dd/MM//yyyy
function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB");
}
</script>

<template>
  <div class="admin-content-full-width">
    <h3 class="mb-4 fw-bolder text-primary">
      <i class="fa-solid fa-users me-2"></i>
      Quản lý Khách hàng
    </h3>

    <div
      v-if="showToastNotification"
      :class="['toast-notification', `bg-${toastType}`, `text-white`]"
      style="z-index: 99999"
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

    <div
      v-if="popupState.isVisible"
      class="modal-overlay"
      style="z-index: 100000"
    >
      <div
        class="custom-popup d-block bg-white p-4 rounded shadow-lg modal-sm"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="`popup-title`"
        style="z-index: 100001"
      >
        <div class="d-flex align-items-center mb-3">
          <i
            :class="[
              'me-3 fa-2x fa-fw',
              // LOGIC LẤY ICON VÀ MÀU CHUẨN TỪ TYPE
              popupState.type === 'success'
                ? 'fa-solid fa-check-circle text-success'
                : popupState.type === 'error'
                ? 'fa-solid fa-times-circle text-danger' /* Màu đỏ cho Lỗi */
                : popupState.type === 'warning'
                ? 'fa-solid fa-exclamation-triangle text-warning' /* Màu vàng cho Warning/Confirm */
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
              // Nút Xác nhận dùng DANGER (Đỏ) khi là confirm, và SUCCESS khi là alert OK
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

    <div class="card shadow-sm border-0">
      <div
        class="card-header bg-white d-flex justify-content-between align-items-center"
      >
        <div style="max-width: 350px; width: 100%">
          <input
            v-model="customerState.keyword"
            type="search"
            class="form-control"
            placeholder="Tìm khách hàng..."
          />
        </div>

        <div class="d-flex align-items-center gap-2 ms-3">
          <span class="badge bg-primary-subtle text-primary-emphasis">
            {{ customerState.totalElements }} khách hàng
          </span>

          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="goToRegister"
          >
            + Thêm khách hàng
          </button>
        </div>
      </div>

      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover table-striped align-middle mb-0">
            <thead class="table-info">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên</th>
                <th scope="col">Email</th>
                <th scope="col">SDT</th>
                <th scope="col">Trạng Thái</th>
                <th scope="col">Ngày Tạo</th>
                <th scope="col">Ngày Cập Nhật</th>
                <th scope="col" class="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="customers.length === 0">
                <td colspan="8" class="text-center text-muted py-4">
                  Khong có khách hàng nào!
                </td>
              </tr>

              <tr
                v-for="(cus, index) in customers"
                :key="cus.id"
                @dblclick="startEdit(cus)"
                class="cursor-pointer"
              >
                <td class="fw-bold">{{ index + 1 }}</td>
                <td>{{ cus.fullname }}</td>
                <td>{{ cus.email }}</td>
                <td>{{ cus.phone }}</td>
                <td>
                  <span
                    class="badge"
                    :class="cus.active ? 'bg-success' : 'bg-danger'"
                  >
                    {{ cus.active ? "Hoạt Động" : "Ẩn" }}
                  </span>
                </td>
                <td class="small text-muted">
                  {{ formatDate(cus.createdAt) }}
                </td>
                <td class="small text-muted">
                  {{ formatDate(cus.updatedAt) }}
                </td>
                <td class="text-center">
                  <div class="btn-group" role="group">
                    <button
                      class="btn btn-sm btn-outline-info"
                      @click="startEdit(cus)"
                    >
                      <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="removeCustomer(cus.id)"
                      :disabled="isProcessing"
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <nav
        v-if="!customerState.isLoading && customerState.totalPages > 0"
        aria-label="Page navigation"
        class="mt-4"
      >
        <ul class="pagination justify-content-center align-items-center">
          <li class="page-item" :class="{ disabled: customerState.page === 0 }">
            <button
              class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
              @click.prevent="prevPage"
              :disabled="customerState.page === 0"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo; Trước</span>
            </button>
          </li>

          <li class="page-item disabled">
            <span class="page-link text-dark fw-bold border-0 bg-transparent">
              Trang {{ customerState.page + 1 }} /
              {{ customerState.totalPages }}
            </span>
          </li>

          <li
            class="page-item"
            :class="{
              disabled: customerState.page >= customerState.totalPages - 1,
            }"
          >
            <button
              class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
              @click.prevent="nextPage"
              :disabled="customerState.page >= customerState.totalPages - 1"
              aria-label="Next"
            >
              <span aria-hidden="true">Sau &raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <Teleport to="body">
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="exampleModalLabel">
                Cập nhật khách hàng
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <div
                v-if="isProcessing"
                class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75"
                style="z-index: 1050"
              >
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              <form @submit.prevent="handleSubmit">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Tên</label>
                    <input
                      v-model="newCustomer.fullname"
                      type="text"
                      class="form-control"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Email</label>
                    <input
                      v-model="newCustomer.email"
                      type="email"
                      class="form-control"
                      disabled
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">SDT</label>
                    <input
                      v-model="newCustomer.phone"
                      type="tel"
                      class="form-control"
                    />
                  </div>
                  <div class="col-12">
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="checkActive"
                        v-model="newCustomer.active"
                      />
                      <label class="form-check-label fw-bold" for="checkActive">
                        Hoạt Động
                      </label>
                    </div>
                  </div>
                </div>

                <div class="mt-4 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    class="btn btn-light me-2"
                    @click="closeModal"
                    :disabled="isProcessing"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    class="btn btn-primary px-4 rounded-pill"
                    :disabled="isProcessing"
                  >
                    <i
                      v-if="isProcessing"
                      class="fa-solid fa-spinner fa-spin me-1"
                    ></i>
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* Loai bo container thua */
.admin-content-full-width {
  width: 100%;
}
.card {
  border-radius: 0.5rem;
}
/* Chuẩn hóa màu sắc */
.table-info {
  background-color: #cce5ff !important;
  color: #0d6efd;
}
.bg-success {
  background-color: #28a745 !important;
} /* Xanh lá chuẩn */
.bg-danger {
  background-color: #dc3545 !important;
} /* Đỏ chuẩn */
.bg-secondary {
  background-color: #6c757d !important;
}

/* FIX: Ensure Modal Content has relative position for loading overlay */
.modal-content {
  position: relative;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 99999;
  padding: 1rem;
  border-radius: 0.5rem;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  /* Màu nền sẽ được quyết định bởi class bg-success/info/danger */
  color: white;
}
/* Pop-up Overlay và Dialog (CUSTOM POPUP) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100000;
}
.custom-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  max-width: 90%;
  z-index: 100001;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}
/* CUSTOM CSS: Phân trang */
.pagination .page-link {
  margin: 0 2px;
}
</style>
