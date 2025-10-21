<script setup>
import { reactive, ref, onMounted } from "vue";
import * as bootstrap from 'bootstrap'; // Import Bootstrap JS

// === CẤU HÌNH API ===
const API_PRODUCT_URL = "http://localhost:8080/api/products"; 
const API_CATEGORY_URL = "http://localhost:8080/api/categories"; 

// === STATE ===
const products = ref([]);
const categories = ref([]); 

const product = reactive({ 
  id: "",
  name: "",
  description: "",
  categoryId: null, // Khóa ngoại
  quantity: 0,
  price: 0,
  isActive: false, 
  images: [], // Mảng URL ảnh hiển thị (preview)
  newFiles: null, // LƯU TRỮ FILE OBJECTS MỚI ĐƯỢC CHỌN
});


// === HÀM TẢI DỮ LIỆU (READ) ===

// 1. Tải Danh mục (cho Dropdown)
async function fetchCategories() {
    try {
        const res = await fetch(API_CATEGORY_URL);
        if (!res.ok) throw new Error(`Lỗi tải danh mục: ${res.status}`);
        categories.value = await res.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        alert('Không thể tải danh mục.');
    }
}

// 2. Tải Sản phẩm
async function loadProducts() {
    try {
        const res = await fetch(API_PRODUCT_URL);
        if (!res.ok) throw new Error(`Lỗi tải sản phẩm: ${res.status}`);
        products.value = await res.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        alert('Không thể tải danh sách sản phẩm.');
    }
}


// === HÀM XỬ LÝ FORM & FILE ===

function editProduct(prod) {
    // Gán dữ liệu vào product reactive state
    Object.assign(product, {
        id: prod.id,
        name: prod.name,
        description: prod.description,
        categoryId: prod.categoryId, 
        quantity: prod.quantity,
        price: prod.price,
        isActive: prod.isActive,
        // Giả định BE trả về mảng có thuộc tính secureUrl hoặc url
        images: prod.images ? [...prod.images.map(img => img.secureUrl || img.url || img)] : [], 
    });
    product.newFiles = null; 
    
    // Chuyển sang Tab Detail
    const tabTrigger = new bootstrap.Tab(
        document.querySelector("#nav-profile-tab")
    );
    tabTrigger.show();
}

function resetForm() {
  Object.assign(product, {
    id: "",
    name: "",
    description: "",
    categoryId: null,
    quantity: 0,
    price: 0,
    isActive: false,
    images: []
  });
    product.newFiles = null;
    document.getElementById('imageInput').value = null; 
    
    // Chuyển về tab List
    new bootstrap.Tab(document.querySelector("#nav-home-tab")).show();
}

// Xử lý file ảnh được chọn
function onImageSelected(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Lưu trữ File Objects MỚI (để gửi qua FormData)
    product.newFiles = files; 

    // Đọc DataURL mới để hiển thị preview
    product.images = [];
    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
            product.images.push(e.target.result); // Lưu DataURL cho preview
        };
        reader.readAsDataURL(files[i]);
    }
    event.target.value = null; // Reset input để cho phép chọn lại cùng file
}

function removeImage(idx) {
    // Logic đơn giản: chỉ xóa preview. Logic xóa ảnh cũ cần API BE riêng.
    product.images.splice(idx, 1);
    // Nếu bạn đang dùng newFiles, bạn có thể cần cập nhật newFiles nếu BE yêu cầu
    if (product.images.length === 0) {
        product.newFiles = null;
    }
}


// === HÀM SUBMIT (CREATE/UPDATE) ===
async function submitProduct() {
    const isUpdating = !!product.id;
    const method = isUpdating ? 'PUT' : 'POST';
    const url = isUpdating ? `${API_PRODUCT_URL}/${product.id}` : API_PRODUCT_URL;
    
    // BƯỚC 1: TẠO REQUEST JSON (KHỚP VỚI ProductRequest BE)
    const productRequest = {
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        categoryId: product.categoryId,
        isActive: product.isActive,
    };

    // BƯỚC 2: XÂY DỰNG FormData
    const formData = new FormData();
    
    // Gửi ảnh mới
    if (product.newFiles) {
        for (let i = 0; i < product.newFiles.length; i++) {
            formData.append('files', product.newFiles[i]); // Tên 'files' phải khớp BE
        }
    }
    
    // Gửi dữ liệu JSON (Tên trường 'product' PHẢI KHỚP với BE)
    formData.append('product', new Blob([JSON.stringify(productRequest)], {
        type: 'application/json'
    }));

    try {
        const res = await fetch(url, {
            method: method,
            body: formData 
        });

        if (!res.ok) throw new Error(`Lưu sản phẩm thất bại: HTTP ${res.status}`);
        
        alert(isUpdating ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công");
        loadProducts(); 
        resetForm();
    } catch (error) {
        console.error("Error submitting product:", error);
        alert(`Lỗi: ${error.message}`);
    }
}

// === HÀM DELETE ===
function deleteProduct(id) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        fetch(`${API_PRODUCT_URL}/${id}`, { method: 'DELETE' })
            .then(res => {
                if (res.status === 204) { 
                    alert("Xóa sản phẩm thành công");
                    loadProducts();
                } else {
                    throw new Error(`Lỗi xóa: HTTP ${res.status}`);
                }
            })
            .catch(error => {
                console.error("Error deleting product:", error);
                alert(`Lỗi khi xóa: ${error.message}`);
            });
    }
}

// === LIFECYCLE HOOKS ===
onMounted(() => {
    loadProducts();
    fetchCategories(); 
});
</script>

<template>
  <div class="container">
    <nav class="mb-3">
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <button
          class="nav-link active"
          id="nav-home-tab"
          data-bs-toggle="tab"
          data-bs-target="#nav-home"
          type="button"
          role="tab"
          aria-controls="nav-home"
          aria-selected="true"
          @click="loadProducts"
        >
          Product List
        </button>
        <button
          class="nav-link"
          id="nav-profile-tab"
          data-bs-toggle="tab"
          data-bs-target="#nav-profile"
          type="button"
          role="tab"
          aria-controls="nav-profile"
          aria-selected="false"
        >
          Product Detail
        </button>
      </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
      <div
        
        role="tabpanel"
        aria-labelledby="nav-home-tab"
        tabindex="0"
      >
        <table class="table" border="1">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(prod, index) in products"
              :key="prod.id"
              @click="editProduct(prod)"
              class="clickable-row"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ prod.name }}</td>
              <td>{{ prod.price }}</td>
              <td>{{ prod.isActive ? "Còn hàng" : "Hết hàng" }}</td>
              <td>
                <button
                  class="btn btn-danger btn-sm"
                  @click.stop="deleteProduct(prod.id)"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="tab-pane fade"
        id="nav-profile"
        role="tabpanel"
        aria-labelledby="nav-profile-tab"
        tabindex="0"
      >
        <form class="mt-2 row g-3" @submit.prevent="submitProduct">
          <div class="col-md-6">
            <label for="productName" class="form-label">Tên sản phẩm</label>
            <input
              type="text"
              class="form-control"
              id="productName"
              v-model="product.name"
              required
            />
          </div>
          <div class="col-md-6">
            <label for="categoryId" class="form-label">Danh mục</label>
            <select
              class="form-select"
              id="categoryId"
              v-model="product.categoryId"
              required
            >
              <option :value="null" disabled>-- Chọn Danh mục --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.categoryName }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="productQuantity" class="form-label">Số lượng</label>
            <input
              type="number"
              class="form-control"
              id="productQuantity"
              v-model.number="product.quantity"
              min="0"
              required
            />
          </div>
          <div class="col-md-3">
            <label for="productPrice" class="form-label">Giá</label>
            <input
              type="number"
              min="0"
              class="form-control"
              id="productPrice"
              v-model.number="product.price"
              required
            />
          </div>
          <div class="col-md-4">
            <div class="form-check mt-4">
              <input
                class="form-check-input"
                type="checkbox"
                id="isActive"
                v-model="product.isActive"
              />
              <label class="form-check-label" for="isActive">
                Hiển thị sản phẩm
              </label>
            </div>
          </div>
          <div class="col-md-12">
            <label for="productDescription" class="form-label">Mô tả</label>
            <textarea
              class="form-control"
              id="productDescription"
              rows="2"
              v-model="product.description"
            ></textarea>
          </div>

          <div class="col-md-12">
            <label class="form-label">Hình ảnh sản phẩm</label>
            <div
              class="d-flex flex-wrap gap-3 border p-2 mb-2"
              style="min-height: 80px; max-height: 200px; overflow-y: auto"
            >
              <div v-for="(img, idx) in product.images" :key="idx" class="position-relative" style="width: 80px; height: 80px">
                <img
                  :src="img"
                  alt="image"
                  class="img-thumbnail"
                  style="object-fit: cover; width: 100%; height: 100%; border-radius: 5px"
                />
                <button
                  type="button"
                  class="btn btn-danger btn-sm position-absolute top-0 end-0"
                  style="border-radius: 50%; padding: 0 6px; line-height: 1"
                  @click="removeImage(idx)"
                  aria-label="Xóa ảnh"
                >
                  &times;
                </button>
              </div>
              <div
                style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center"
              >
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  @change="onImageSelected"
                  multiple
                  style="display: none"
                />
                <label
                  for="imageInput"
                  class="btn btn-outline-primary d-flex align-items-center justify-content-center"
                  style="width: 100%; height: 100%; cursor: pointer; font-size: 24px; margin: 0"
                  title="Thêm ảnh"
                >
                  +
                </label>
              </div>
            </div>
          </div>

          <hr />

          <div class="col-12">
            <button type="submit" class="btn btn-primary">
              {{ product.id ? "Cập nhật" : "Thêm mới" }}
            </button>
            <button type="button" class="btn btn-secondary ms-2" @click="resetForm">
              Reset
            </button>
          </div>
        </form>
      </div>
      </div>
  </div>
</template>

<style scoped>
/* CSS cho các hàng có thể click được */
.clickable-row {
    cursor: pointer;
}

/* Thêm hiệu ứng hover nhẹ để đẹp hơn (tùy chọn) */
.clickable-row:hover {
    background-color: #f0f0f0 !important; /* Đổi màu nền khi hover */
}
</style>