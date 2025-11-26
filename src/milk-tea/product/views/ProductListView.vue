// product/views/ProductListView.vue (SỬA ĐỔI)

<script setup>
import { onMounted } from "vue"; // <--- BỔ SUNG: Import onMounted
import { loadCategories, loadProducts, productState } from "../composables/ProductsBase.js";
import { categories } from "../composables/ProductListView.js";
import ProductList from "../components/ProductList.vue"; // Component hiển thị các card sản phẩm


onMounted(async() => {
    productState.category = 'All'
    productState.keyword = ''
    productState.page = 0

    await loadProducts()
    loadCategories();
})
</script>

<template>
  <div class="container py-4">
    <h1 class="fw-bold mb-4 text-center">MENU</h1>
    <hr class="mb-4" />
    <div class="d-flex gap-4">
      <!-- SIDEBAR -->
      <div class="sidebar shadow-sm p-3 rounded flex-shrink-0">
        <h5 class="fw-semibold mb-3">Danh mục</h5>

        <!-- SEARCH -->
        <input v-model="productState.keyword" type="search" class="form-control mb-3" placeholder="Tìm sản phẩm..."
          @keyup.enter="searchProducts" />

        <!-- CATEGORY LIST -->
        <ul class="list-unstyled category-list mb-0">
          <li v-for="c in categories" :key="c" :class="['category-item', { active: productState.category === c }]"
            @click="productState.category = c">
            {{ c }}
          </li>
        </ul>
      </div>

      <!-- PRODUCT LIST -->
      <div class="flex-grow-1">
        <div v-if="productState.isLoading" class="text-center py-5">
          <div class="spinner-border text-warning"></div>
          <p class="mt-2">Đang tải danh sách sản phẩm...</p>
        </div>

        <div v-else-if="productState.error" class="alert alert-danger text-center">
          Lỗi: {{ productState.error }}
          <button class="btn btn-sm btn-danger ms-3" @click="loadProducts">
            Thử lại
          </button>
        </div>

        <ProductList v-else />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Flexbox sidebar & product list */
.d-flex {
  align-items: flex-start;
}

/* Sidebar */
.sidebar {
  width: 250px;
  max-height: 600px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
}

/* Categories */
.category-list {
  padding: 0;
  margin: 0;
}

.category-item {
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s ease;
  font-weight: 500;
  color: #444;
  margin-bottom: 4px;
}

.category-item:hover {
  background: #f3f3f3;
}

.category-item.active {
  background: #ffca2c;
  color: #000;
  font-weight: 600;
}

/* Product list spacing */
.flex-grow-1 {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
