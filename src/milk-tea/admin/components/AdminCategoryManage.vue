<script setup>
import { ref, onMounted, computed, watch } from "vue";
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

const formState = ref({
    categoryName: '',
    isActive: true,
});
const editingId = ref(null);

const resetForm = () => {
    editingId.value = null;
    formState.value = { categoryName: '', isActive: true };
};

const editCategory = (category) => {
    editingId.value = category.id;
    formState.value = {
        categoryName: category.categoryName,
        isActive: category.isActive,
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

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

        alert(editingId.value ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
        resetForm();

    } catch (error) {
        console.error("Error saving data:", error);
        alert(`Lỗi khi lưu danh mục: ${categoryState.error || error.message}`);
    }
    await loadCategories();

};

const deleteCategoryHandler = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    try {
        await deleteCategory(id);
        alert('Xóa thành công!');
    } catch (error) {
        console.error("Error deleting data:", error);
        alert(`Lỗi khi xóa danh mục: ${categoryState.error || error.message}`);
    }
    await loadCategories();

};

// LOGIC TÌM KIẾM REALTIME 
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

function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB");
}

onMounted(() => {
    loadCategories();
});
</script>

<template>
    <div class="container-fluid py-2">
        <h3 class=" fw-bolder text-primary">
            <i class="fa-solid fa-layer-group me-2"></i> Quản Lý Danh Mục
        </h3>

        <!-- HÀNG TÌM KIẾM VÀ TỔNG SỐ -->
        <div class="col col-md-12">
            <div class="card shadow-sm border-0 mb-3">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <div style="max-width: 350px; width: 100%;">
                        <input v-model="categoryState.keyword" type="search" class="form-control"
                            placeholder="Tìm danh mục..." />

                    </div>

                    <div class="d-flex align-items-center gap-2 ms-3">
                        <span class="badge bg-primary-subtle text-primary-emphasis">
                            {{ categoryState.totalElements }} Danh mục
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-2">
            <div class="col-lg-3 col-md-12">
                <div class="card shadow-sm border-0">
                    <div class="card-body">
                        <h5 class="card-title fw-bold text-dark mb-4">
                            {{ editingId ? 'Cập Nhật Danh Mục' : 'Tạo Danh Mục Mới' }}
                        </h5>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Tên Danh Mục:</label>
                            <input type="text" class="form-control" v-model="formState.categoryName"
                                placeholder="Ví dụ: Điện Tử, Thời Trang..." />
                        </div>

                        <div class="mb-4">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="checkNativeSwitch"
                                    v-model="formState.isActive" />
                                <label class="form-check-label fw-semibold" for="checkNativeSwitch">
                                    <span
                                        :class="{ 'text-success': formState.isActive, 'text-muted': !formState.isActive }">
                                        Trạng Thái: {{ formState.isActive ? "Hoạt Động" : "Không Hoạt Động" }}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-warning fw-bold" @click="saveCategoryHandler"
                                :disabled="isLoading">
                                <i :class="editingId ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-plus'"></i>
                                {{ editingId ? 'CẬP NHẬT' : 'TẠO MỚI' }}
                            </button>

                            <button type="button" v-if="editingId" class="btn btn-outline-secondary fw-bold"
                                @click="resetForm" :disabled="isLoading">
                                Hủy Bỏ (Cancel)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-9 col-md-12">
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
                                        <td colspan="6" class="text-center py-3 text-muted">Không có danh mục nào.</td>
                                    </tr>
                                    <tr v-for="(cat, index) in categories" :key="cat.id">
                                        <td class="fw-bold">{{ categoryState.page * categoryState.size + index + 1 }}
                                        </td>
                                        <td class="text-dark">{{ cat.categoryName }}</td>
                                        <td>
                                            <span
                                                :class="{ 'badge bg-danger': cat.isActive, 'badge bg-success': !cat.isActive }">
                                                {{ cat.isActive ? "Hoạt Động" : "Ẩn" }}
                                            </span>
                                        </td>
                                        <td>{{ formatDate(cat.createdAt) }}</td>
                                        <td>{{ formatDate(cat.updatedAt) }}</td>
                                        <td class="text-center">
                                            <button class="btn btn-sm btn-outline-info " @click="editCategory(cat)"
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

                <!-- KHỐI PHÂN TRANG -->
                <nav v-if="!isLoading && categoryState.totalPages > 0" aria-label="Page navigation" class="mt-4">
                    <ul class="pagination justify-content-center align-items-center">

                        <!-- Nut Prev -->
                        <li class="page-item" :class="{ disabled: categoryState.page === 0 }">
                            <button class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
                                @click.prevent="prevPage" :disabled="categoryState.page === 0" aria-label="Previous">
                                <span aria-hidden="true">&laquo; Trước</span>
                            </button>
                        </li>

                        <li class="page-item disabled">
                            <span class="page-link text-dark fw-bold border-0 bg-transparent">
                                Trang {{ categoryState.page + 1 }} / {{ categoryState.totalPages }}
                            </span>
                        </li>

                        <!-- Nút NEXT -->
                        <li class="page-item" :class="{ disabled: categoryState.page >= categoryState.totalPages - 1 }">
                            <button class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
                                @click.prevent="nextPage" :disabled="categoryState.page >= categoryState.totalPages - 1"
                                aria-label="Next">
                                <span aria-hidden="true">Sau &raquo;</span>
                            </button>
                        </li>

                    </ul>
                </nav>
            </div>
        </div>
    </div>
</template>