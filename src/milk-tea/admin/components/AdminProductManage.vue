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
        <button
          class="nav-link"
          id="nav-contact-tab"
          data-bs-toggle="tab"
          data-bs-target="#nav-contact"
          type="button"
          role="tab"
          aria-controls="nav-contact"
          aria-selected="false"
        >
          Contact
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
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên sản phẩm</th>
              <th>Slug</th>
              <th>Giá</th>
              <th>Hiển thị</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prod in productStore.products" :key="prod.id" @click="editProduct(prod)">
              <td>{{ prod.id }}</td>
              <td>{{ prod.name }}</td>
              <td>{{ prod.slug }}</td>
              <td>{{ prod.price }}</td>
              <td>{{ prod.is_active ? 'Có' : 'Không' }}</td>
              <td>
                <button class="btn btn-danger btn-sm" @click.stop="deleteProduct(prod.id)">Xóa</button>
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
        <form class="row g-3" @submit.prevent="submitProduct">
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
            <label for="productSlug" class="form-label">Slug</label>
            <input
              type="text"
              class="form-control"
              id="productSlug"
              v-model="product.slug"
              required
            />
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
          <div class="col-md-4">
            <label for="categoryId" class="form-label">Danh mục</label>
            <select
              id="categoryId"
              class="form-select"
              v-model="product.category_id"
              required
            >
              <option disabled value="">Chọn danh mục...</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
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
          <div class="col-md-4">
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
          <div class="col-12">
            <button type="submit" class="btn btn-primary">
              {{ product.id ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </form>
      </div>

      <div
        class="tab-pane fade"
        id="nav-contact"
        role="tabpanel"
        aria-labelledby="nav-contact-tab"
        tabindex="0"
      >
        Liên hệ...
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useProductStore } from '../store/AdminProductManage.js'

const productStore = useProductStore()

const product = reactive({
  id: '',
  name: '',
  slug: '',
  description: '',
  category_id: '',
  quantity: 0,
  price: 0,
  is_active: false
})

const categories = ref([
  { id: 'uuid-1', name: 'Trà sữa' },
  { id: 'uuid-2', name: 'Trà trái cây' },
  { id: 'uuid-3', name: 'Đồ ăn vặt' }
])

function loadProducts() {
  productStore.loadProducts()
}

function editProduct(prod) {
  Object.assign(product, prod)
  // Chuyển sang tab Detail
  const tabTrigger = new bootstrap.Tab(document.querySelector('#nav-profile-tab'))
  tabTrigger.show()
}

function resetForm() {
  Object.assign(product, {
    id: '',
    name: '',
    slug: '',
    description: '',
    category_id: '',
    quantity: 0,
    price: 0,
    is_active: false
  })
}

function submitProduct() {
  if (product.id) {
    productStore.update({ ...product })
    alert('Cập nhật sản phẩm thành công')
  } else {
    productStore.add({ ...product })
    alert('Thêm sản phẩm thành công')
  }
  resetForm()
}
function deleteProduct(id) {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    productStore.remove(id)
  }
}
</script>
