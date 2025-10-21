<script setup>
import { ref, onMounted } from "vue";
// NÊN DÙNG AXIOS HOẶC DÙNG BASE_URL CHÍNH XÁC CHO MÔI TRƯỜNG CỦA BẠN
const API_URL = "http://localhost:8080/api/categories"; 

// State cho danh sách Categories
const categories = ref([]);

// State cho Form nhập liệu (Tạo/Sửa)
const formState = ref({
    // Đã bỏ slug, sửa lại name thành categoryName
    categoryName: '', 
    sortOrder: 0,
    isActive: true,
});

// State để theo dõi ID đang được chỉnh sửa
const editingId = ref(null); 

// === HÀM TIỆN ÍCH ===
// Hàm Reset Form
const resetForm = () => {
    editingId.value = null;
    formState.value = { categoryName: '', sortOrder: 0, isActive: true };
};

// === HÀM CRUD ===

// 1. READ ALL
const fetchCategories = async () => {
    try {
        const res = await fetch(API_URL); 
        if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
        // categories.value = await res.json();
        // LƯU Ý: Nếu BE trả về List<CategoryResponse> -> Cần map lại
        const data = await res.json();
        categories.value = data; 
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// 2. CREATE / UPDATE
const saveCategory = async () => {
    const method = editingId.value ? 'PUT' : 'POST';
    const url = editingId.value ? `${API_URL}/${editingId.value}` : API_URL;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formState.value)
        });

        if (!res.ok) throw new Error("Failed to save category");
        
        alert(editingId.value ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
        fetchCategories(); 
        resetForm();
    } catch (error) {
        console.error("Error saving data:", error);
        alert(`Lỗi khi lưu danh mục: ${error.message}`);
    }
    await loadCategories();
};

// 3. EDIT (Tải dữ liệu vào Form)
const editCategory = (category) => {
    editingId.value = category.id;
    // Gán dữ liệu của hàng vào formState (Cẩn thận tên trường)
    formState.value = {
        categoryName: category.categoryName, // Dùng categoryName từ BE
        sortOrder: category.sortOrder,
        isActive: category.isActive,
    };
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
};

// 4. DELETE
const deleteCategory = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (res.status !== 204) throw new Error("Failed to delete category");
        
        alert('Xóa thành công!');
        fetchCategories();
    } catch (error) {
        console.error("Error deleting data:", error);
        alert(`Lỗi khi xóa danh mục: ${error.message}`);
    }
    await loadCategories();
};

// Tải dữ liệu lần đầu
onMounted(() => {
    fetchCategories();
});
</script>
<template>
<div class="container">
    <div class="row">
        
        <div class="col-sm-3">
            <div>
                <div class="mb-3">
                    <div class="mb-3">
                        <label class="form-label fw-bold">Name:</label>
                        <input type="text" class="form-control" v-model="formState.categoryName" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Sort Order:</label>
                        <input type="number" class="form-control" v-model.number="formState.sortOrder" />
                    </div>
                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="checkNativeSwitch"
                                v-model="formState.isActive"
                            />
                            <label class="form-check-label fw-bold" for="checkNativeSwitch">
                                Active
                            </label>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center gap-3">
                        <button type="button" 
                                class="btn btn-warning btn-lg rounded-pill border border-5" 
                                @click="saveCategory">
                            {{ editingId ? 'Update' : 'Create' }}
                        </button>
                        <button type="button" 
                                v-if="editingId"
                                class="btn btn-light btn-lg rounded-pill border border-5" 
                                @click="resetForm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-sm-9">
            <table class="table table-light table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Sort Order</th>
                        <th scope="col">Active</th>
                        <th scope="col">Create at</th>
                        <th scope="col">Update at</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(cat, index) in categories" :key="cat.id">
                        <td class="fw-bold">{{ index + 1 }}</td> 
                        <td>{{ cat.categoryName }}</td>
                        <td>{{ cat.sortOrder }}</td>
                        <td>{{ cat.isActive ? "Yes" : "No" }}</td>
                        <td>{{ cat.createdAt }}</td>
                        <td>{{ cat.updatedAt }}</td>
                        <td>
                            <button class="btn me-3" @click="editCategory(cat)">
                                <i class="fa-solid fa-pencil"></i>
                            </button>
                        </td>
                        <td>
                            <button class="btn me-3" @click="deleteCategory(cat.id)">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>