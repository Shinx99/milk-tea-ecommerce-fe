<script setup>
import { RouterLink } from 'vue-router'

defineProps({
    product: { type: Object, required: true },
    bestSale: { type: Boolean, default: false }
})

// === HÀM TRUY CẬP ẢNH ĐẠI DIỆN ===
// Thường dùng computed property nếu cần logic phức tạp hơn,
// nhưng ở đây ta có thể xử lý trực tiếp trong template.
</script>

<template>
    <div class="card text-center px-3 py-3 shadow-sm border-warning-subtle h-100">

        <img 
            v-if="product.imageUrl && product.imageUrl.length > 0"
            :src="product.imageUrl[0]" 
            class="card-img-top" 
            :alt="product.name" 
        />
        
        <div v-else class="card-img-top d-flex align-items-center justify-content-center text-muted border-bottom" style="height: 200px; background-color: #f8f9fa;">
            [Ảnh bị thiếu]
        </div>

        <h6 class="fw-semibold">{{ product.name }}</h6>
        <div class=" text-warning fw-bold">
            {{ product.price.toLocaleString() }} đ
        </div>
        
        <RouterLink
            :to="`/products/${product.id}`" 
            class="btn btn-warning mx-4">
            <i class="bi bi-cart"></i> Yeu cau
        </RouterLink>

    </div>
</template>

<style scoped>
.card-img-top { object-fit: contain; height: 200px; }
</style>