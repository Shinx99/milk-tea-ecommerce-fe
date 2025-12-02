<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import * as bootstrap from 'bootstrap';

// 1. Import Composable (Quản lý State danh sách & Phân trang)
import {
    productState,
    loadProducts,
    nextPage,
    prevPage,
    categoryState,
    loadCategories,
    // ===== IMPORT CÁC HÀM CRUD MỚI =====
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct
} from '../composables/UseProduct';

const newImageUrl = ref("");
const edittingId = ref(null); // Null = Thêm mới, Có ID = Đang sửa
const fileInputRef = ref(null);

// Form Model
const productForm = reactive({
    name: "",
    categoryId: null,
    price: 0,
    quantity: 0,
    description: "",
    active: true,
    imageUrl: []
});

// Lấy danh sách sản phẩm từ Composable
const products = computed(() => productState.list);

// Lay danh sach category tu Composable
const categories = computed(() => categoryState.list);

// === LIFECYCLE ===
onMounted(async () => {
    productState.category = 'All';
    productState.keyword = '';
    productState.page = 0;

    await loadCategories(); // Gọi hàm load danh mục
    await loadProducts();   // Gọi hàm load sản phẩm từ Composable
});

// === HÀM LOGIC ===

// 2. Mở Form Thêm mới
function openCreateModal() {
    resetForm();
    openModal();
}

// 3. Mở Form Sửa (Fill data)
function startEdit(prod) {
    edittingId.value = prod.id;
    Object.assign(productForm, {
        name: prod.name,
        categoryId: prod.categoryId || prod.category?.id,
        price: prod.price,
        quantity: prod.quantity,
        description: prod.description,
        active: prod.active,
        imageUrl: prod.imageUrl ? [...prod.imageUrl] : []
    });
    newImageUrl.value = "";
    openModal();
}

// 4. Reset Form
function resetForm() {
    edittingId.value = null;
    Object.assign(productForm, {
        name: "",
        categoryId: null,
        price: 0,
        quantity: 0,
        description: "",
        active: true,
        imageUrl: []
    });
    newImageUrl.value = "";
    
    // Reset input file
    if (fileInputRef.value) {
        fileInputRef.value.value = "";
    }
}

// ===== 5. SUBMIT FORM (ĐÃ SỬA - Gọi Composable) =====
async function submitProduct() {
    // Validate cơ bản
    if (!productForm.name || !productForm.categoryId) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
    }

    let success = false;

    try {
        if (edittingId.value) {
            // Cập nhật
            success = await handleUpdateProduct(edittingId.value, productForm);
        } else {
            // Tạo mới
            success = await handleCreateProduct(productForm);
        }

        if (success) {
            alert(edittingId.value ? "Cập nhật thành công!" : "Thêm mới thành công!");
            closeModal();
        } else {
            // Lỗi đã được xử lý trong Composable, hiển thị từ actionError
            alert("Lỗi: " + (productState.actionError || "Không xác định"));
        }
    } catch (err) {
        alert("Lỗi hệ thống: " + err.message);
    }
}

// ===== 6. XÓA SẢN PHẨM (ĐÃ SỬA - Gọi Composable) =====
async function confirmDelete(id) {
    if (!confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;

    const success = await handleDeleteProduct(id);

    if (success) {
        alert("Đã xóa thành công!");
    } else {
        alert("Lỗi xóa: " + (productState.actionError || "Không xác định"));
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
    if(el) bootstrap.Modal.getOrCreateInstance(el).show();
}

function closeModal() {
    const el = document.getElementById("productModal");
    if(!el) return;
    const instance = bootstrap.Modal.getInstance(el);
    if(instance) instance.hide();
    
    // Cleanup backdrop
    document.querySelectorAll(".modal-backdrop").forEach(e => e.remove());
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
}

//Format createdAt va updatedAt theo dd/MM/yyyy
function formatDate(dateString){
  if(!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB");
}

// ===== LOGIC UPLOAD ẢNH CLOUDINARY =====

const isUploading = ref(false); // State loading riêng cho upload

// CẤU HÌNH CLOUDINARY
const CLOUD_NAME = "drri2uxvy"; 
const UPLOAD_PRESET = "ml_default"; 

// Hàm này được gọi khi chọn file
async function handleFileUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    isUploading.value = true;

    // Upload song song tất cả file đã chọn
    const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));

    try {
        const urls = await Promise.all(uploadPromises);
        
        // Lọc bỏ các url lỗi (null) và thêm vào danh sách ảnh của form
        const validUrls = urls.filter(url => url !== null);
        productForm.imageUrl.push(...validUrls);
        
    } catch (error) {
        alert("Lỗi tải ảnh: " + error.message);
    } finally {
        isUploading.value = false;
        event.target.value = ""; // Reset input để chọn lại được file cũ
    }
}

// Hàm helper upload 1 file
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        return data.secure_url; // Trả về link ảnh HTTPS
    } catch (err) {
        console.error("Lỗi upload file:", file.name, err);
        return null;
    }
}

</script>

<template>
    <h3 class="mb-4 fw-bolder text-primary">
        <i class="fa-solid fa-boxes-stacked me-2"></i>
        Quản lý Sản phẩm
    </h3>

    <div class="container">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white py-3">
                <div class="d-flex flex-wrap gap-3 justify-content-between align-items-center">

                <!-- Nhóm bên trái: Search + Danh mục -->
                <div class="d-flex flex-wrap gap-3 align-items-center">

                    <!-- Ô tìm kiếm -->
                    <div style="width: 190px">
                            <input
                                v-model="productState.keyword"
                                type="search"
                                class="form-control"
                                placeholder="Tìm kiếm sản phẩm..."
                            />
                    </div>

                    <!-- Ô chọn danh mục -->
                <div style="width: 250px">
                    <select
                        class="form-select form-select-sm"
                            v-model="productState.category"  
                        >
                        <option value="All">-- Tất cả danh mục --</option> 
                        <option v-for="cat in categories" :key="cat.id" :value="cat.categoryName">
                            {{ cat.categoryName }}
                        </option>
                    </select>
                </div>
            </div>

                <!-- Nhóm bên phải: Badge + nút thêm -->
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

            <!-- Table -->
            <div class="card-body p-0 table-responsive mt-3">
                <!-- Loading -->
                <div v-if="productState.isLoading" class="text-center py-5 text-primary">
                    <div class="spinner-border" role="status"></div>
                    <div class="mt-2">Đang tải dữ liệu...</div>
                </div>

                <table v-else class="table table-hover align-middle mb-0">
                    <thead class="table-light">
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
                            <td colspan="10" class="text-center text-muted py-4">Không tìm thấy dữ liệu</td>
                        </tr>

                        <tr v-for="(p, i) in products" :key="p.id" @dblclick="startEdit(p)" style="cursor: pointer;">
                            <td class="fw-bold">{{ i + 1 + (productState.page * productState.size) }}</td>
                            <td>{{ p.name }}</td>
                            <td>{{ p.category.categoryName }}</td>
                            <td>
                                <img 
                                    v-if="p.imageUrl && p.imageUrl.length > 0" 
                                    :src="p.imageUrl[0]" 
                                    class="rounded border object-fit-cover" 
                                    width="40" height="40"
                                    onerror="this.style.display='none'"
                                />
                                <span v-else class="small text-muted">No img</span>
                            </td>
                            <td class="fw-bold text-success">
                                {{ new Intl.NumberFormat('vi-VN').format(p.price) }} ₫
                            </td>
                            <td>{{ p.quantity }}</td>
                            <td>
                                <span class="badge" :class="p.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-dark'">
                                    {{ p.active ? 'Đang bán' : 'Ngừng bán' }}
                                </span>
                            </td>
                             <td class="small text-muted">{{ formatDate(p.createdAt) }}</td>
                            <td class="small text-muted">{{ formatDate(p.updatedAt) }}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-outline-primary me-1" @click="startEdit(p)">
                                    <i class="fa-solid fa-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(p.id)">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Footer Pagination -->
            <div class="card-footer bg-white py-3 d-flex justify-content-center" v-if="productState.totalPages > 1">
                <nav>
                    <ul class="pagination mb-0">
                        <li class="page-item" :class="{ disabled: productState.page === 0 }">
                            <button class="page-link" @click="prevPage"><i class="fa-solid fa-chevron-left"></i></button>
                        </li>
                        <li class="page-item disabled">
                            <span class="page-link text-dark fw-bold border-0">
                                Trang {{ productState.page + 1 }} / {{ productState.totalPages }}
                            </span>
                        </li>
                        <li class="page-item" :class="{ disabled: productState.page >= productState.totalPages - 1 }">
                            <button class="page-link" @click="nextPage"><i class="fa-solid fa-chevron-right"></i></button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Modal Form -->
        <div class="modal fade" id="productModal" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title fw-bold">
                            {{ edittingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới' }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <!-- ===== LOADING OVERLAY TRONG MODAL ===== -->
                        <div v-if="productState.isActionLoading" 
                             class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" 
                             style="z-index: 1050;">
                            <div class="spinner-border text-primary" role="status"></div>
                        </div>

                        <form @submit.prevent="submitProduct" class="row g-3">
                            <!-- Tên -->
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Tên sản phẩm</label>
                                <input type="text" class="form-control" v-model="productForm.name" required>
                            </div>
                            <!-- Danh mục -->
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Danh mục</label>
                                <select class="form-select" v-model="productForm.categoryId" required>
                                    <option :value="null" disabled>-- Chọn danh mục --</option>
                                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                        {{ cat.categoryName }}
                                    </option>
                                </select>
                            </div>
                            <!-- Giá & Số lượng -->
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Giá bán</label>
                                <input type="number" class="form-control" v-model.number="productForm.price" required min="0">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Số lượng</label>
                                <input type="number" class="form-control" v-model.number="productForm.quantity" required min="0">
                            </div>
                            <!-- Mô tả -->
                            <div class="col-12">
                                <label class="form-label fw-bold">Mô tả</label>
                                <textarea class="form-control" rows="2" v-model="productForm.description"></textarea>
                            </div>
                            <!-- Trạng thái -->
                            <div class="col-12">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="activeSwitch" v-model="productForm.active">
                                    <label class="form-check-label fw-bold" for="activeSwitch">Đang kinh doanh</label>
                                </div>
                            </div>
                            
                            <hr>
                            
                            <!-- Ảnh -->
<div class="col-12">
    <label class="form-label fw-bold">Hình ảnh</label>
    
    <!-- Input File thay cho Input Text -->
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
        >
        <label class="input-group-text" for="fileInput">
            <span v-if="isUploading" class="spinner-border spinner-border-sm text-primary me-1"></span>
            {{ isUploading ? 'Đang tải lên...' : 'Tải ảnh lên' }}
        </label>
    </div>

    <!-- Danh sách ảnh đã có -->
    <div class="d-flex flex-wrap gap-2 p-2 bg-light border rounded">
        <div v-for="(img, idx) in productForm.imageUrl" :key="idx" class="position-relative" style="width: 70px; height: 70px;">
            <img :src="img" class="w-100 h-100 object-fit-cover rounded border">
            <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 rounded-circle" 
                style="width: 18px; height: 18px; line-height: 1; transform: translate(30%, -30%)"
                @click="removeImage(idx)">&times;</button>
        </div>
        <span v-if="productForm.imageUrl.length === 0" class="text-muted w-100 text-center small my-auto">Chưa có ảnh</span>
    </div>
</div>


                            <!-- Footer -->
                            <div class="col-12 text-end mt-4">
                                <button type="button" class="btn btn-light me-2" @click="closeModal">Hủy</button>
                                <button type="submit" class="btn btn-primary px-4" :disabled="productState.isActionLoading">
                                    {{ productState.isActionLoading ? 'Đang xử lý...' : 'Lưu lại' }}
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
.bg-success-subtle { background-color: #d1e7dd; color: #0f5132; }
.bg-secondary-subtle { background-color: #e2e3e5; color: #41464b; }
.object-fit-cover { object-fit: cover; }
</style>
