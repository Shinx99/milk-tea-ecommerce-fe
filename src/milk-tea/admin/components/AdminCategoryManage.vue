<script setup>
import { ref, onMounted } from "vue";
// NÊN DÙNG AXIOS HOẶC DÙNG BASE_URL CHÍNH XÁC CHO MÔI TRƯỜNG CỦA BẠN
const API_URL = "http://localhost:8080/api/categories";

// State cho danh sách Categories
const categories = ref([]);

// State cho Form nhập liệu (Tạo/Sửa)
const formState = ref({
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

        // --- START SỬA ĐỔI QUAN TRỌNG NHẤT ---
        const responseData = await res.json();

        // Kiểm tra xem dữ liệu có nằm trong trường 'data' và 'success' là true không
        if (responseData.success && Array.isArray(responseData.data)) {
            // GÁN DỮ LIỆU TỪ TRƯỜNG 'data' CỦA PHẢN HỒI API
            categories.value = responseData.data;
        } else {
            // Xử lý nếu API trả về lỗi logic (ví dụ: success: false)
            console.error("API Error:", responseData.message);
            categories.value = []; // Xóa dữ liệu cũ
        }
        // --- END SỬA ĐỔI QUAN TRỌNG NHẤT ---

    } catch (error) {
        console.error("Error fetching data:", error);
        alert(`Lỗi khi tải danh mục: ${error.message}`);
    }
};

// 2. CREATE / UPDATE
const saveCategory = async () => {
    // Xác định phương thức và URL dựa trên trạng thái chỉnh sửa (editingId)
    const method = editingId.value ? 'PUT' : 'POST';
    const url = editingId.value ? `${API_URL}/${editingId.value}` : API_URL;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formState.value)
        });

        // Nếu HTTP status code không phải 2xx (ví dụ: 400, 500)
        if (!res.ok) {
            // Đọc chi tiết lỗi từ body nếu có thể
            const errorData = await res.json().catch(() => ({ message: res.statusText }));
            throw new Error(errorData.message || "Failed to save category");
        }

        alert(editingId.value ? 'Cập nhật thành công!' : 'Tạo mới thành công!');

        // Cập nhật giao diện:
        fetchCategories(); // GỌI LẠI ĐỂ LẤY DỮ LIỆU MỚI NHẤT
        resetForm();

    } catch (error) {
        console.error("Error saving data:", error);
        alert(`Lỗi khi lưu danh mục: ${error.message}`);
    }
    // Dòng 'await loadCategories();' ĐÃ BỊ XÓA vì nó dư thừa và không cần thiết.
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

// --- 2. HÀM DELETE CATEGORY ---
const deleteCategory = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            // Nếu không thành công 
            const errorData = await res.json().catch(() => ({ message: res.statusText }));
            throw new Error(errorData.message || "Failed to delete category");
        }
        // Giả định res.ok là đủ, hoặc kiểm tra res.status === 204 nếu Backend bắt buộc.

        alert('Xóa thành công!');

        // Cập nhật giao diện:
        fetchCategories(); // GỌI LẠI ĐỂ LẤY DỮ LIỆU MỚI NHẤT

    } catch (error) {
        console.error("Error deleting data:", error);
        alert(`Lỗi khi xóa danh mục: ${error.message}`);
    }
};

const loadCategories = fetchCategories;

// Tải dữ liệu lần đầu
onMounted(() => {
    fetchCategories();
});
</script>
<template>
    <div class="container-fluid py-2">
        <h3 class="mb-4 fw-bolder text-primary">
            <i class="fa-solid fa-layer-group me-2"></i> Quản Lý Danh Mục
        </h3>

        <div class="row g-2">
            <div class="col-lg-4 col-md-12">
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

                        <div class="mb-3">
                            <label class="form-label fw-semibold">Thứ Tự Sắp Xếp (Sort Order):</label>
                            <input type="number" class="form-control" v-model.number="formState.sortOrder"
                                placeholder="0" />
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
                            <button type="button" class="btn btn-warning  fw-bold" @click="saveCategory">
                                <i :class="editingId ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-plus'"></i>
                                {{ editingId ? 'CẬP NHẬT' : 'TẠO MỚI' }}
                            </button>

                            <button type="button" v-if="editingId" class="btn btn-outline-secondary fw-bold"
                                @click="resetForm">
                                Hủy Bỏ (Cancel)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-8 col-md-12">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover table-striped mb-0">
                                <thead class="table-primary text-white">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Tên</th>
                                        <th scope="col">Sắp Xếp</th>
                                        <th scope="col">Trạng Thái</th>
                                        <th scope="col">Ngày Tạo</th>
                                        <th scope="col">Ngày Cập Nhật</th>
                                        <th scope="col" class="text-center">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(cat, index) in categories" :key="cat.id">
                                        <td class="fw-bold">{{ index + 1 }}</td>
                                        <td class="text-dark">{{ cat.categoryName }}</td>
                                        <td>{{ cat.sortOrder }}</td>
                                        <td>
                                            <span
                                                :class="{ 'badge bg-success': cat.isActive, 'badge bg-danger': !cat.isActive }">
                                                {{ cat.isActive ? "Hoạt Động" : "Ẩn" }}
                                            </span>
                                        </td>
                                        <td>{{ cat.createdAt }}</td>
                                        <td>{{ cat.updatedAt }}</td>
                                        <td class="text-center">
                                            <button class="btn btn-sm btn-outline-info me-2" @click="editCategory(cat)">
                                                <i class="fa-solid fa-pen"></i>
                                            </button>

                                            <button class="btn btn-sm btn-outline-danger"
                                                @click="deleteCategory(cat.id)">
                                                <i class="fa-solid fa-trash-can"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

</script>