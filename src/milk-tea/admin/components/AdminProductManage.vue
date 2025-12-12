<script setup>
import { reactive, ref, onMounted, computed, watch, nextTick } from "vue";
import * as bootstrap from "bootstrap";

// 1. Import Composable (Quản lý State danh sách & Phân trang)
import {
  productState,
  loadProducts,
  nextPage,
  prevPage,
  categoryState,
  loadCategories,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
} from "../composables/UseProduct";

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
    // Dùng type cho icon màu sắc
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

const newImageUrl = ref("");
const edittingId = ref(null);
const fileInputRef = ref(null);

// Form Model
const productForm = reactive({
  name: "",
  categoryId: null,
  price: 0,
  quantity: 0,
  description: "",
  active: true,
  imageUrl: [],
});

const products = computed(() => productState.list);
const categories = computed(() => categoryState.list);

// === LIFECYCLE ===
onMounted(async () => {
  productState.category = "All";
  productState.keyword = "";
  productState.page = 0;

  await loadCategories();
  await loadProducts();
});

// === HÀM LOGIC ===

function openCreateModal() {
  resetForm();
  openModal();
}

function startEdit(prod) {
  edittingId.value = prod.id;
  Object.assign(productForm, {
    name: prod.name,
    categoryId: prod.categoryId || prod.category?.id,
    price: prod.price,
    quantity: prod.quantity,
    description: prod.description,
    active: prod.active,
    imageUrl: prod.imageUrl ? [...prod.imageUrl] : [],
  });
  newImageUrl.value = "";
  openModal();
}

function resetForm() {
  edittingId.value = null;
  Object.assign(productForm, {
    name: "",
    categoryId: null,
    price: 0,
    quantity: 0,
    description: "",
    active: true,
    imageUrl: [],
  });
  newImageUrl.value = "";

  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
}

// ===== 5. SUBMIT FORM (Sử dụng Pop-up/Toast) =====
async function submitProduct() {
  isProcessing.value = true;

  if (!productForm.name || !productForm.categoryId) {
    showAlertPopup(
      "Vui lòng điền đầy đủ thông tin bắt buộc!",
      "Lỗi nhập liệu",
      "warning"
    );
    isProcessing.value = false;
    return;
  }

  let success = false;

  try {
    if (edittingId.value) {
      success = await handleUpdateProduct(edittingId.value, productForm);
    } else {
      success = await handleCreateProduct(productForm);
    }

    if (success) {
      showToast(
        edittingId.value
          ? "Cập nhật sản phẩm thành công!"
          : "Thêm sản phẩm mới thành công!",
        "success"
      );
      closeModal();
    } else {
      showAlertPopup(
        "Lỗi: " + (productState.actionError || "Không xác định"),
        "Lỗi Lưu",
        "error"
      );
    }
  } catch (err) {
    showAlertPopup("Lỗi hệ thống: " + err.message, "Lỗi Hệ thống", "error");
  } finally {
    isProcessing.value = false;
    await loadProducts();
  }
}

// ===== 6. XÓA SẢN PHẨM (Sử dụng Pop-up Xác nhận) =====
async function confirmDelete(id) {
  if (isProcessing.value) return;

  // Gửi type 'warning' cho Pop-up xác nhận
  if (
    !(await showConfirmPopup(
      "Bạn chắc chắn muốn xóa sản phẩm này?",
      "Xác nhận xóa",
      "warning"
    ))
  )
    return;

  isProcessing.value = true;
  showToast("Đang xử lý xóa...", "info");

  try {
    const success = await handleDeleteProduct(id);

    if (success) {
      showToast("Đã xóa sản phẩm thành công!", "success");
    } else {
      showAlertPopup(
        "Lỗi xóa: " + (productState.actionError || "Không xác định"),
        "Lỗi Xóa",
        "error"
      );
    }
  } catch (err) {
    showAlertPopup(
      "Lỗi hệ thống khi xóa: " + err.message,
      "Lỗi Hệ thống",
      "error"
    );
  } finally {
    isProcessing.value = false;
    await loadProducts();
  }
}

// 7. Logic thêm ảnh vào mảng (Frontend)
function addImageUrl() {
  const url = newImageUrl.value.trim();
  if (url && !productForm.imageUrl.includes(url)) {
    productForm.imageUrl.push(url);
    newImageUrl.value = "";
  }
}

function removeImage(index) {
  productForm.imageUrl.splice(index, 1);
}

// === HELPER MODAL ===
function openModal() {
  const el = document.getElementById("productModal");
  if (el) bootstrap.Modal.getOrCreateInstance(el).show();
}

function closeModal() {
  const el = document.getElementById("productModal");
  if (!el) return;
  const instance = bootstrap.Modal.getInstance(el);
  if (instance) instance.hide();

  document.querySelectorAll(".modal-backdrop").forEach((e) => e.remove());
  document.body.classList.remove("modal-open");
  document.body.style.removeProperty("padding-right");
}

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB");
}

// ===== LOGIC UPLOAD ẢNH CLOUDINARY (Giữ nguyên) =====
const isUploading = ref(false);
const CLOUD_NAME = "drri2uxvy";
const UPLOAD_PRESET = "ml_default";

async function handleFileUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  isUploading.value = true;
  showToast("Đang tải ảnh lên Cloudinary...", "info");

  const uploadPromises = Array.from(files).map((file) =>
    uploadToCloudinary(file)
  );

  try {
    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter((url) => url !== null);
    productForm.imageUrl.push(...validUrls);

    if (validUrls.length > 0) {
      showToast(`Đã tải lên thành công ${validUrls.length} ảnh!`, "success");
    }
  } catch (error) {
    showAlertPopup("Lỗi tải ảnh: " + error.message, "Lỗi Cloudinary", "error");
  } finally {
    isUploading.value = false;
    event.target.value = "";
  }
}

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.error("Lỗi upload file:", file.name, err);
    return null;
  }
}
</script>

<template>
  <div class="admin-content-full-width">
    <h3 class="mb-4 fw-bolder text-primary">
      <i class="fa-solid fa-boxes-stacked me-2"></i>
      Quản lý Sản phẩm
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
      <div class="card-header bg-white py-3">
        <div
          class="d-flex flex-wrap gap-3 justify-content-between align-items-center"
        >
          <div class="d-flex flex-wrap gap-3 align-items-center">
            <div style="width: 190px">
              <input
                v-model="productState.keyword"
                type="search"
                class="form-control"
                placeholder="Tìm kiếm sản phẩm..."
              />
            </div>

            <div style="width: 250px">
              <select
                class="form-select form-select-sm"
                v-model="productState.category"
              >
                <option value="All">-- Tất cả danh mục --</option>
                <option
                  v-for="cat in categories"
                  :key="cat.id"
                  :value="cat.categoryName"
                >
                  {{ cat.categoryName }}
                </option>
              </select>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2 ms-auto mt-2 mt-md-0">
            <span class="badge bg-primary-subtle text-primary-emphasis">
              {{ productState.totalElements }} sản phẩm
            </span>
            <button class="btn btn-primary btn-sm" @click="openCreateModal">
              <i class="fa-solid fa-plus me-1"></i> Thêm mới
            </button>
          </div>
        </div>
      </div>

      <div class="card-body p-0 table-responsive mt-3">
        <div
          v-if="productState.isLoading"
          class="text-center py-5 text-primary"
        >
          <div class="spinner-border" role="status"></div>
          <div class="mt-2">Đang tải dữ liệu...</div>
        </div>

        <table v-else class="table table-hover align-middle mb-0">
          <thead class="table-info">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Loại sản phẩm</th>
              <th scope="col">Ảnh</th>
              <th scope="col">Giá bán</th>
              <th scope="col">Tồn kho</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Ngày Tạo</th>
              <th scope="col">Ngày Cập Nhật</th>
              <th scope="col" class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="products.length === 0">
              <td colspan="10" class="text-center text-muted py-4">
                Không tìm thấy dữ liệu
              </td>
            </tr>

            <tr
              v-for="(p, i) in products"
              :key="p.id"
              @dblclick="startEdit(p)"
              style="cursor: pointer"
            >
              <td class="fw-bold">
                {{ i + 1 + productState.page * productState.size }}
              </td>
              <td>{{ p.name }}</td>
              <td>{{ p.category?.categoryName }}</td>
              <td>
                <img
                  v-if="p.imageUrl && p.imageUrl.length > 0"
                  :src="p.imageUrl[0]"
                  class="rounded border object-fit-cover"
                  width="40"
                  height="40"
                  onerror="this.style.display='none'"
                />
                <span v-else class="small text-muted">No img</span>
              </td>
              <td class="fw-bold text-success">
                {{ new Intl.NumberFormat("vi-VN").format(p.price) }} ₫
              </td>
              <td>{{ p.quantity }}</td>
              <td>
                <span
                  class="badge"
                  :class="p.active ? 'bg-success' : 'bg-danger'"
                >
                  {{ p.active ? "Đang bán" : "Ngừng bán" }}
                </span>
              </td>
              <td class="small text-muted">{{ formatDate(p.createdAt) }}</td>
              <td class="small text-muted">{{ formatDate(p.updatedAt) }}</td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-outline-info me-1"
                  @click="startEdit(p)"
                >
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="confirmDelete(p.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="card-footer bg-white py-3 d-flex justify-content-center"
        v-if="productState.totalPages > 1"
      >
        <nav>
          <ul class="pagination mb-0 justify-content-center align-items-center">
            <li
              class="page-item"
              :class="{ disabled: productState.page === 0 }"
            >
              <button
                class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
                @click="prevPage"
                :disabled="productState.page === 0"
              >
                &laquo; Trước
              </button>
            </li>
            <li class="page-item disabled">
              <span class="page-link border-0 bg-transparent text-dark fw-bold">
                Trang {{ productState.page + 1 }} /
                {{ productState.totalPages }}
              </span>
            </li>
            <li
              class="page-item"
              :class="{
                disabled: productState.page >= productState.totalPages - 1,
              }"
            >
              <button
                class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
                @click="nextPage"
                :disabled="productState.page >= productState.totalPages - 1"
              >
                Sau &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title fw-bold">
              {{ edittingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới" }}
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeModal"
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

            <form @submit.prevent="submitProduct" class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold">Tên sản phẩm</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="productForm.name"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Danh mục</label>
                <select
                  class="form-select"
                  v-model="productForm.categoryId"
                  required
                >
                  <option :value="null" disabled>-- Chọn danh mục --</option>
                  <option
                    v-for="cat in categories"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.categoryName }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Giá bán</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="productForm.price"
                  required
                  min="0"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Số lượng</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="productForm.quantity"
                  required
                  min="0"
                />
              </div>
              <div class="col-12">
                <label class="form-label fw-bold">Mô tả</label>
                <textarea
                  class="form-control"
                  rows="2"
                  v-model="productForm.description"
                ></textarea>
              </div>
              <div class="col-12">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="activeSwitch"
                    v-model="productForm.active"
                  />
                  <label class="form-check-label fw-bold" for="activeSwitch"
                    >Đang kinh doanh</label
                  >
                </div>
              </div>

              <hr />

              <div class="col-12">
                <label class="form-label fw-bold">Hình ảnh</label>

                <div class="input-group mb-2">
                  <input
                    type="file"
                    ref="fileInputRef"
                    class="form-control"
                    id="fileInput"
                    accept="image/*"
                    multiple
                    @change="handleFileUpload"
                    :disabled="isUploading"
                  />
                  <label class="input-group-text" for="fileInput">
                    <span
                      v-if="isUploading"
                      class="spinner-border spinner-border-sm text-primary me-1"
                    ></span>
                    {{ isUploading ? "Đang tải lên..." : "Tải ảnh lên" }}
                  </label>
                </div>

                <div class="d-flex flex-wrap gap-2 p-2 bg-light border rounded">
                  <div
                    v-for="(img, idx) in productForm.imageUrl"
                    :key="idx"
                    class="position-relative"
                    style="width: 70px; height: 70px"
                  >
                    <img
                      :src="img"
                      class="w-100 h-100 object-fit-cover rounded border"
                    />
                    <button
                      type="button"
                      class="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 rounded-circle"
                      style="
                        width: 18px;
                        height: 18px;
                        line-height: 1;
                        transform: translate(30%, -30%);
                      "
                      @click="removeImage(idx)"
                    >
                      &times;
                    </button>
                  </div>
                  <span
                    v-if="productForm.imageUrl.length === 0"
                    class="text-muted w-100 text-center small my-auto"
                    >Chưa có ảnh</span
                  >
                </div>
              </div>

              <div class="col-12 text-end mt-4">
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
                  :disabled="isProcessing"
                >
                  <i
                    v-if="isProcessing"
                    class="fa-solid fa-spinner fa-spin me-1"
                  ></i>
                  {{ isProcessing ? "Đang xử lý..." : "Lưu lại" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
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
.text-danger {
  color: #dc3545 !important;
}
.text-warning {
  color: #ffc107 !important;
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
