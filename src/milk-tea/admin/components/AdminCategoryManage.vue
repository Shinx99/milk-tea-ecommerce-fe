<script setup>
import { ref, onMounted, computed, watch } from "vue";
import * as bootstrap from "bootstrap";
import {
  categoryState,
  loadCategories,
  saveCategory,
  deleteCategory,
  nextPage,
  prevPage,
} from "../composables/UseCategory.js";

/* --------------------- */
/* STATE FORM */
/* --------------------- */
const categories = computed(() => categoryState.list);
const isLoading = computed(() => categoryState.isLoading);

const formState = ref({
  categoryName: "",
  isActive: true,
});
const editingId = ref(null);

/* --------------------- */
/* MODAL */
/* --------------------- */
const modalRef = ref(null);
let modalInstance = null;

const openCreateModal = () => {
  editingId.value = null;
  formState.value = { categoryName: "", isActive: true };
  modalInstance?.show();
};

const startEdit = (category) => {
  editingId.value = category.id;
  formState.value = {
    categoryName: category.categoryName,
    isActive: category.isActive,
  };
  modalInstance?.show();
};

const closeModal = () => modalInstance?.hide();

/* --------------------- */
/* TOAST & POPUP NOTIFICATION (Đã thêm Pop-up Logic) */
/* --------------------- */

// Toast State
const toastMessage = ref("");
const toastType = ref("success");
const showToast = ref(false);

const triggerToast = (msg, type = "success") => {
  toastMessage.value = msg;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 2200);
};

// Pop-up State (Dùng cho xác nhận Xóa và thông báo lỗi)
const popupState = ref({
  isVisible: false,
  message: "",
  title: "",
  isConfirm: false,
  resolve: null, // Dùng để xử lý Promise của Confirm
});

// Hàm hiển thị Pop-up xác nhận (Confirm)
function showConfirmPopup(message, title = "Xác nhận") {
  return new Promise((resolve) => {
    popupState.value.title = title;
    popupState.value.message = message;
    popupState.value.isConfirm = true;
    popupState.value.resolve = resolve;
    popupState.value.isVisible = true;
  });
}

// Hàm hiển thị Pop-up Alert (Dùng cho lỗi)
function showAlertPopup(message, title = "Thông báo") {
  popupState.value.title = title;
  popupState.value.message = message;
  popupState.value.isConfirm = false;
  popupState.value.isVisible = true;
}

// Xử lý đóng Pop-up
function handlePopupClose(confirmed = false) {
  if (popupState.value.isConfirm && popupState.value.resolve) {
    popupState.value.resolve(confirmed);
  }
  popupState.value.isVisible = false;
  popupState.value.resolve = null;
}

/* --------------------- */
/* SAVE CATEGORY (Đã sửa dùng Pop-up/Toast) */
/* --------------------- */
const saveCategoryHandler = async () => {
  if (!formState.value.categoryName) {
    triggerToast("Tên danh mục không được để trống!", "error");
    return;
  }

  try {
    const payload = {
      categoryName: formState.value.categoryName,
      isActive: formState.value.isActive,
    };

    await saveCategory(editingId.value, payload);

    triggerToast(
      editingId.value ? "Cập nhật thành công!" : "Tạo mới thành công!"
    );
    closeModal();
  } catch (error) {
    showAlertPopup(
      `Lỗi lưu danh mục: ${error.message || "Không xác định"}`,
      "Lỗi Lưu"
    ); // Dùng Pop-up cho lỗi
  }

  await loadCategories();
};

/* --------------------- */
/* DELETE CATEGORY (Đã sửa dùng Pop-up Xác nhận) */
/* --------------------- */
const deleteCategoryHandler = async (id) => {
  // Kích hoạt Pop-up xác nhận trước
  if (!(await showConfirmPopup("Bạn có chắc chắn muốn xóa danh mục này?"))) {
    return;
  }

  triggerToast(`Đang xoá danh mục...`, "info");

  try {
    await deleteCategory(id);
    triggerToast("Xóa thành công!");
  } catch (err) {
    showAlertPopup(
      `Lỗi khi xóa danh mục: ${err.message || "Không xác định"}`,
      "Lỗi Xóa"
    ); // Dùng Pop-up cho lỗi
  }

  await loadCategories();
};

/* --------------------- */
/* SEARCH REALTIME */
/* --------------------- */
watch(
  () => categoryState.keyword,
  () => {
    clearTimeout(categoryState.searchTimeout);
    categoryState.searchTimeout = setTimeout(() => {
      categoryState.page = 0;
      loadCategories();
    }, 600);
  }
);

const formatDate = (x) => (!x ? "" : new Date(x).toLocaleDateString("en-GB"));

onMounted(() => {
  loadCategories();
  modalInstance = bootstrap.Modal.getOrCreateInstance(modalRef.value);
});
</script>

<template>
  <div class="container-fluid py-2">
    <h3 class="fw-bolder text-primary">
      <i class="fa-solid fa-layer-group me-2"></i> Quản Lý Danh Mục
    </h3>

    <div class="card shadow-sm border-0 mb-3">
      <div
        class="card-header bg-white d-flex justify-content-between align-items-center py-3 flex-wrap gap-2"
      >
        <div style="width: 250px">
          <input
            v-model="categoryState.keyword"
            type="search"
            class="form-control"
            placeholder="Tìm danh mục..."
          />
        </div>

        <div class="d-flex gap-2">
          <span class="badge bg-primary-subtle text-primary-emphasis">
            {{ categoryState.totalElements }} danh mục
          </span>

          <button class="btn btn-primary btn-sm" @click="openCreateModal">
            <i class="fa-solid fa-plus me-1"></i> Thêm mới
          </button>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover table-striped align-middle mb-0">
            <thead class="table-primary text-white">
              <tr>
                <th>#</th>
                <th>Tên</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Ngày cập nhật</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="categories.length === 0 && !isLoading">
                <td colspan="6" class="text-center py-3 text-muted">
                  Không có danh mục nào.
                </td>
              </tr>

              <tr v-for="(cat, index) in categories" :key="cat.id">
                <td>
                  {{ categoryState.page * categoryState.size + index + 1 }}
                </td>
                <td>{{ cat.categoryName }}</td>

                <td>
                  <span
                    :class="{
                      'badge bg-danger': cat.isActive,
                      'badge bg-success': !cat.isActive,
                    }"
                  >
                    {{ cat.isActive ? "Hoạt động" : "Ẩn" }}
                  </span>
                </td>

                <td>{{ formatDate(cat.createdAt) }}</td>
                <td>{{ formatDate(cat.updatedAt) }}</td>

                <td class="text-center">
                  <button
                    class="btn btn-sm btn-outline-info me-1"
                    @click="startEdit(cat)"
                  >
                    <i class="fa-solid fa-pen"></i>
                  </button>

                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="deleteCategoryHandler(cat.id)"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <nav v-if="!isLoading && categoryState.totalPages > 0" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: categoryState.page === 0 }">
          <button
            class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
            @click.prevent="prevPage"
          >
            &laquo; Trước
          </button>
        </li>

        <li class="page-item disabled">
          <span class="page-link border-0 bg-transparent text-dark fw-bold">
            Trang {{ categoryState.page + 1 }} /
            {{ categoryState.totalPages }}
          </span>
        </li>

        <li
          class="page-item"
          :class="{
            disabled: categoryState.page >= categoryState.totalPages - 1,
          }"
        >
          <button
            class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
            @click.prevent="nextPage"
          >
            Sau &raquo;
          </button>
        </li>
      </ul>
    </nav>

    <div
      class="modal fade"
      id="categoryModal"
      tabindex="-1"
      ref="modalRef"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog modal-md modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title fw-bold">
              {{ editingId ? "Cập nhật danh mục" : "Thêm danh mục mới" }}
            </h5>

            <button
              class="btn-close btn-close-white"
              @click="closeModal"
            ></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="saveCategoryHandler" class="row g-3">
              <div class="col-12">
                <label class="form-label fw-bold">Tên danh mục</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formState.categoryName"
                  required
                />
              </div>

              <div class="col-12">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="formState.isActive"
                  />
                  <label class="form-check-label fw-bold">
                    Trạng thái:
                    {{ formState.isActive ? "Hoạt động" : "Không hoạt động" }}
                  </label>
                </div>
              </div>

              <div class="col-12 text-end mt-3">
                <button
                  type="button"
                  class="btn btn-light me-2"
                  @click="closeModal"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  class="btn btn-primary px-4"
                  :disabled="isLoading"
                >
                  {{ isLoading ? "Đang xử lý..." : "Lưu lại" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <transition name="modal-fade">
      <div
        v-if="popupState.isVisible"
        class="modal-overlay"
        style="z-index: 100000"
      >
        <div
          class="custom-popup d-block bg-white p-4 rounded shadow-lg modal-sm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="popup-title"
        >
          <div class="d-flex align-items-center mb-3">
            <i
              class="me-3 fa-2x fa-fw"
              :class="{
                'fa-solid fa-circle-question text-warning':
                  popupState.isConfirm,
                'fa-solid fa-circle-exclamation text-danger':
                  !popupState.isConfirm,
              }"
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
                popupState.isConfirm ? 'btn-primary' : 'btn-success',
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

    <transition name="toast-fade">
      <div
        v-if="showToast"
        :class="[
          'toast-notification',
          toastType === 'error'
            ? 'toast-error'
            : toastType === 'info'
            ? 'toast-info'
            : 'toast-success',
        ]"
      >
        <i
          v-if="toastType === 'success'"
          class="fa-solid fa-circle-check fs-4 me-2 text-white"
        ></i>
        <i
          v-else-if="toastType === 'error'"
          class="fa-solid fa-circle-xmark fs-4 me-2 text-white"
        ></i>
        <i v-else class="fa-solid fa-circle-info fs-4 me-2 text-white"></i>

        <span class="fw-semibold">{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Toast container */
.toast-notification {
  position: fixed;
  top: 20px; /* Vị trí chuẩn */
  right: 20px; /* Vị trí chuẩn */
  z-index: 2000;
  padding: 0.9rem 1.2rem;
  border-radius: 0.6rem;
  min-width: 300px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  background: #198754;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
}

/* Màu theo loại */
.toast-success {
  background: #198754 !important; /* xanh lá bootstrap */
}

.toast-error {
  background: #dc3545 !important; /* đỏ */
}

.toast-info {
  background: #0d6efd !important; /* xanh dương */
}

/* ICON TRẮNG */
.toast-notification i {
  color: white !important;
}

/* Animation */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.45s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(120%);
}

/* Pop-up Overlay và Dialog (CUSTOM POPUP) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.custom-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  max-width: 90%;
  z-index: 1050;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

/* Animation cho Pop-up */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .custom-popup,
.modal-fade-leave-active .custom-popup {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.modal-fade-enter-from .custom-popup,
.modal-fade-leave-to .custom-popup {
  transform: translate(-50%, -60%);
  opacity: 0;
}

/* Đảm bảo bảng hiển thị đúng */
.table-info {
  background-color: #cce5ff !important;
  color: #0d6efd;
}
.table-primary {
  background-color: var(--bs-primary);
  color: white;
}
</style>
