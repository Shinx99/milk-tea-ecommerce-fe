<script setup>
import { RouterLink } from "vue-router";

defineProps({
  product: { type: Object, required: true },
  bestSale: { type: Boolean, default: false },
});

// === HÀM TRUY CẬP ẢNH ĐẠI DIỆN ===
// Thường dùng computed property nếu cần logic phức tạp hơn,
// nhưng ở đây ta có thể xử lý trực tiếp trong template.
</script>

<template>
  <div class="product-card h-100">
    <!-- Ảnh sản phẩm -->
    <div class="image-wrapper">
      <img v-if="product.imageUrl && product.imageUrl.length > 0" :src="product.imageUrl[0]" class="product-img"
        :alt="product.name" />
      <div v-else class="no-image">[Ảnh bị thiếu]</div>
    </div>

    <!-- Thông tin -->
    <div class="info">
      <h6 class="name">{{ product.name }}</h6>

      <p class="price">{{ product.price.toLocaleString() }} đ</p>

      <RouterLink :to="`/products/${product.id}`" class="btn-buy">
        <i class="bi bi-cart me-2"></i>
        Đặt mua
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* === WRAPPER CHUNG === */
.product-card {
  border-radius: 12px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #f1f1f1;
  transition: all 0.25s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
}

/* === VÙNG ẢNH === */
.image-wrapper {
  width: 100%;
  height: 220px;
  border-radius: 10px;
  background-color: #f8f9fa;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Ảnh chuẩn không bể */
.product-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Ảnh thiếu */
.no-image {
  color: #bbb;
  font-size: 14px;
}

/* === INFO === */
.info {
  margin-top: 12px;
  text-align: center;
}

.name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
  min-height: 40px;
  /* tránh nhảy layout khi tên dài */
}

.price {
  font-size: 17px;
  font-weight: 700;
  color: #ff7b00;
  margin-bottom: 12px;
}

/* === BUTTON === */
.btn-buy {
  display: block;
  width: 100%;
  padding: 8px 0;
  border-radius: 8px;
  background-color: #ffca2c;
  border: none;
  font-weight: 600;
  color: #333;
  transition: 0.2s ease;
  text-decoration: none;
}

.btn-buy:hover {
  background-color: #ffb000;
  transform: scale(1.03);
}
</style>
