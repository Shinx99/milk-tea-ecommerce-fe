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

// LẤY DỮ LIỆU VÀ TRẠNG THÁI
const categories = computed(() => categoryState.list);
const isLoading = computed(() => categoryState.isLoading);

// STATE FORM
const formState = ref({
    categoryName: "",
    isActive: true,
});
const editingId = ref(null);

// MODAL
const modalRef = ref(null);
let modalInstance = null;

// FORMAT DATE
function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB");
}

// MỞ MODAL THÊM MỚI
const openCreateModal = () => {
    editingId.value = null;
    formState.value = { categoryName: "", isActive: true };
    if (modalInstance) modalInstance.show();
};

// MỞ MODAL SỬA
const startEdit = (category) => {
    editingId.value = category.id;
    formState.value = {
        categoryName: category.categoryName,
        isActive: category.isActive,
    };
    if (modalInstance) modalInstance.show();
};

// ĐÓNG MODAL
const closeModal = () => {
    if (modalInstance) modalInstance.hide();
};

// LƯU (TẠO MỚI / CẬP NHẬT)
const saveCategoryHandler = async () => {
    if (!formState.value.categoryName) {
        alert("Tên danh mục không được để trống.");
        return;
    }
    try {
        const payload = {
            categoryName: formState.value.categoryName,
            isActive: formState.value.isActive,
        };

        await saveCategory(editingId.value, payload);

        alert(editingId.value ? "Cập nhật thành công!" : "Tạo mới thành công!");
        closeModal();
    } catch (error) {
        console.error("Error saving data:", error);
        alert(`Lỗi khi lưu danh mục: ${categoryState.error || error.message}`);
    }
    await loadCategories();
};

// XÓA DANH MỤC
const deleteCategoryHandler = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
        await deleteCategory(id);
        alert("Xóa thành công!");
    } catch (error) {
        console.error("Error deleting data:", error);
        alert(`Lỗi khi xóa danh mục: ${categoryState.error || error.message}`);
    }
    await loadCategories();
};

// TÌM KIẾM REALTIME
watch(
    () => categoryState.keyword,
    () => {
        if (categoryState.searchTimeout) {
            clearTimeout(categoryState.searchTimeout);
        }
        categoryState.searchTimeout = setTimeout(() => {
            categoryState.page = 0;
            loadCategories();
        }, 600);
    }
);

onMounted(() => {
    loadCategories();
    if (modalRef.value) {
        modalInstance = bootstrap.Modal.getOrCreateInstance(modalRef.value);
    }
});
</script>

<template>
    <div class="container-fluid py-2">
        <h3 class="fw-bolder text-primary">
            <i class="fa-solid fa-layer-group me-2"></i> Quản Lý Danh Mục
        </h3>

        <!-- HÀNG TÌM KIẾM + TỔNG + THÊM MỚI -->
        <div class="col col-md-12">
            <div class="card shadow-sm border-0 mb-3">
                <div
                    class="card-header bg-white py-3 d-flex flex-wrap gap-3 justify-content-between align-items-center">
                    <!-- Search -->
                    <div class="d-flex flex-wrap gap-3 align-items-center">
                        <div style="width: 250px">
                            <input v-model="categoryState.keyword" type="search" class="form-control"
                                placeholder="Tìm danh mục..." />
                        </div>
                    </div>

                    <!-- Badge + Thêm mới -->
                    <div class="d-flex align-items-center gap-2 ms-auto mt-2 mt-md-0">
                        <span class="badge bg-primary-subtle text-primary-emphasis">
                            {{ categoryState.totalElements }} danh mục
                        </span>
                        <button class="btn btn-primary btn-sm" @click="openCreateModal">
                            <i class="fa-solid fa-plus me-1"></i> Thêm mới
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- BẢNG DANH MỤC -->
        <div class="row g-2">
            <div class="col-lg-12 col-md-12">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover table-striped align-middle mb-0">
                                <thead class="table-primary text-white">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Tên</th>
                                        <th scope="col">Trạng Thái</th>
                                        <th scope="col">Ngày Tạo</th>
                                        <th scope="col">Ngày Cập Nhật</th>
                                        <th scope="col" class="text-center">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="categories.length === 0 && !isLoading">
                                        <td colspan="6" class="text-center py-3 text-muted">
                                            Không có danh mục nào.
                                        </td>
                                    </tr>
                                    <tr v-for="(cat, index) in categories" :key="cat.id">
                                        <td class="fw-bold">
                                            {{ categoryState.page * categoryState.size + index + 1 }}
                                        </td>
                                        <td class="text-dark">{{ cat.categoryName }}</td>
                                        <td>
                                            <span :class="{
                                                'badge bg-danger': cat.isActive,
                                                'badge bg-success': !cat.isActive,
                                            }">
                                                {{ cat.isActive ? "Hoạt Động" : "Ẩn" }}
                                            </span>
                                        </td>
                                        <td>{{ formatDate(cat.createdAt) }}</td>
                                        <td>{{ formatDate(cat.updatedAt) }}</td>
                                        <td class="text-center">
                                            <button class="btn btn-sm btn-outline-info" @click="startEdit(cat)"
                                                :disabled="isLoading">
                                                <i class="fa-solid fa-pen"></i>
                                            </button>

                                            <button class="btn btn-sm btn-outline-danger"
                                                @click="deleteCategoryHandler(cat.id)">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- PHÂN TRANG -->
                <nav v-if="!isLoading && categoryState.totalPages > 0" aria-label="Page navigation" class="mt-4">
                    <ul class="pagination justify-content-center align-items-center">
                        <li class="page-item" :class="{ disabled: categoryState.page === 0 }">
                            <button class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
                                @click.prevent="prevPage" :disabled="categoryState.page === 0" aria-label="Previous">
                                <span aria-hidden="true">&laquo; Trước</span>
                            </button>
                        </li>

                        <li class="page-item disabled">
                            <span class="page-link text-dark fw-bold border-0 bg-transparent">
                                Trang {{ categoryState.page + 1 }} /
                                {{ categoryState.totalPages }}
                            </span>
                        </li>

                        <li class="page-item" :class="{
                            disabled: categoryState.page >= categoryState.totalPages - 1,
                        }">
                            <button class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
                                @click.prevent="nextPage" :disabled="categoryState.page >= categoryState.totalPages - 1
                                    " aria-label="Next">
                                <span aria-hidden="true">Sau &raquo;</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- MODAL FORM DANH MỤC -->
        <div class="modal fade" id="categoryModal" tabindex="-1" data-bs-backdrop="static" ref="modalRef">
            <div class="modal-dialog modal-md modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title fw-bold">
                            {{ editingId ? "Cập nhật danh mục" : "Thêm danh mục mới" }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveCategoryHandler" class="row g-3">
                            <div class="col-12">
                                <label class="form-label fw-bold">Tên danh mục</label>
                                <input type="text" class="form-control" v-model="formState.categoryName" required
                                    placeholder="Ví dụ: Điện tử, Thời trang..." />
                            </div>

                            <div class="col-12">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="activeSwitch"
                                        v-model="formState.isActive" />
                                    <label class="form-check-label fw-bold" for="activeSwitch">
                                        Trạng thái:
                                        {{ formState.isActive ? "Hoạt động" : "Không hoạt động" }}
                                    </label>
                                </div>
                            </div>

                            <div class="col-12 text-end mt-3">
                                <button type="button" class="btn btn-light me-2" @click="closeModal">
                                    Hủy
                                </button>
                                <button type="submit" class="btn btn-primary px-4" :disabled="isLoading">
                                    {{ isLoading ? "Đang xử lý..." : "Lưu lại" }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
