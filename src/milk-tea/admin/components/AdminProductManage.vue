<template>
  <div class="container">
    <nav>
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
        class="tab-pane fade show active"
        id="nav-home"
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
              v-for="(prod, index) in productStore.products"
              :key="prod.id"
              @click="editProduct(prod)"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ prod.name }}</td>
              <td>{{ prod.price }}</td>
              <td>{{ prod.is_active ? "Còn hàng" : "Hết hàng" }}</td>
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
    <label for="categoryName" class="form-label">Danh mục</label>
    <input
      type="text"
      class="form-control"
      id="categoryName"
      v-model="product.category_name"
      readonly
    />
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
        v-model="product.is_active"
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

  <div class=" col-md-12">
    <label class="form-label">Hình ảnh sản phẩm</label>
    <div class="d-flex flex-wrap gap-3 border p-2 mb-2" style="min-height: 80px; max-height: 200px; overflow-y: auto;">
      <div v-for="(img, idx) in product.images" :key="idx" class="position-relative" style="width: 80px; height: 80px;">
        <img
          :src="img"
          alt="image"
          class="img-thumbnail"
          style="object-fit: cover; width: 100%; height: 100%; border-radius: 5px;"
        />
        <button
          type="button"
          class="btn btn-danger btn-sm position-absolute top-0 end-0"
          style="border-radius: 50%; padding: 0 6px; line-height: 1;"
          @click="removeImage(idx)"
          aria-label="Xóa ảnh"
        >
          &times;
        </button>
      </div>
      <div style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
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
          style="width: 100%; height: 100%; cursor: pointer; font-size: 24px; margin: 0;"
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
    <button type="button" class="btn btn-secondary ms-2" @click="resetForm">Reset</button>  </div>
</form>

      </div>

      
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useProductStore } from "../store/AdminProductManage.js";

const productStore = useProductStore();

const product = reactive({
  id: "",
  name: "",
  slug: "",
  description: "",
  category_id: "",
  quantity: 0,
  price: 0,
  is_active: false,
  images: []
});

const categories = ref([
  { id: "uuid-1", name: "Trà sữa" },
  { id: "uuid-2", name: "Trà trái cây" },
  { id: "uuid-3", name: "Đồ ăn vặt" },
]);

// Gọi loadProducts khi mount component để tự load dữ liệu
onMounted(() => {
  loadProducts();
});

function loadProducts() {
  productStore.loadProducts();
}

function editProduct(prod) {
  Object.assign(product, prod);
  product.images = prod.images ? [...prod.images] : [];
  const tabTrigger = new bootstrap.Tab(
    document.querySelector("#nav-profile-tab")
  );
  tabTrigger.show();
}

function resetForm() {
  Object.assign(product, {
    id: "",
    name: "",
    slug: "",
    description: "",
    category_id: "",
    quantity: 0,
    price: 0,
    is_active: false,
    images: []
  });
}

function submitProduct() {
  if (product.id) {
    productStore.update({ ...product });
    alert("Cập nhật sản phẩm thành công");
  } else {
    productStore.add({ ...product });
    alert("Thêm sản phẩm thành công");
  }
  resetForm();
}

function deleteProduct(id) {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
    productStore.remove(id);
  }
}

function onImageSelected(event) {
  const files = event.target.files;
  if (!files.length) return;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = (e) => {
      product.images.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
  event.target.value = "";
}

function removeImage(idx) {
  product.images.splice(idx, 1);
}


</script>
