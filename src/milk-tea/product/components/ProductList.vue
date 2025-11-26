<script setup>
import ProductCard from './ProductCard.vue'

// 1. Import State và các hàm điều khiển trang từ file logic của bạn
import { 
  nextPage, 
  prevPage, 
  changePage 
} from '../composables/ProductListView.js'

import { productState } from '../composables/ProductsBase' 

</script>

<template>
  <div>
    <!-- Loading Spinner (Optional: Hiển thị khi đang tải) -->
    <div v-if="productState.isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- DANH SÁCH SẢN PHẨM -->
    <div v-else class="row g-3">
      <div 
        v-for="p in productState.list" 
        :key="p.id" 
        class="col-12 col-sm-6 col-lg-4 col-xl-3"
      >
        <ProductCard :product="p" />
      </div>

      <!-- Hiển thị thông báo nếu không tìm thấy sản phẩm -->
      <div v-if="productState.list.length === 0" class="text-center py-5">
        <p class="text-muted">Không tìm thấy sản phẩm nào.</p>
      </div>
    </div>


    <nav v-if="!productState.isLoading && productState.totalPages > 0" aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center align-items-center">
        

        <li class="page-item" :class="{ disabled: productState.page === 0 }">
          <button 
            class="page-link" 
            @click.prevent="prevPage" 
            :disabled="productState.page === 0"
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo; Trước</span>
          </button>
        </li>

        <li class="page-item disabled">
          <span class="page-link text-dark fw-bold border-0 bg-transparent">
            Trang {{ productState.page + 1 }} / {{ productState.totalPages }}
          </span>
        </li>

        <!-- Nút NEXT -->
        <!-- Disable nếu đang ở trang cuối cùng -->
        <li class="page-item" :class="{ disabled: productState.page >= productState.totalPages - 1 }">
          <button 
            class="page-link" 
            @click.prevent="nextPage"
            :disabled="productState.page >= productState.totalPages - 1" 
            aria-label="Next"
          >
            <span aria-hidden="true">Sau &raquo;</span>
          </button>
        </li>

      </ul>
    </nav>
  </div>
</template>

<style scoped>
/* CSS tùy chỉnh nhẹ để nút bấm đẹp hơn nếu cần */
.page-link {
  cursor: pointer;
}
.page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.6;
}
</style>
