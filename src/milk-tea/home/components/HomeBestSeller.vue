<script setup>
import { homeState } from "../store.js";
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="container my-5">
    <h3 class="text-center fw-bold mb-4 text-success">
      BEST SELLERS - TRÀ SỮA ĐẬM VỊ
    </h3>

    <div class="row g-4">
      <div
        class="col-md-3"
        v-for="item in homeState.bestSellers"
        :key="item.id"
      >
        <div class="home-card h-100">
          <!-- IMAGE WRAPPER -->
          <div class="image-wrapper">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="product-img"
            />
            <div v-else class="no-image">[Ảnh bị thiếu]</div>
          </div>

          <!-- INFO -->
          <div class="info">
            <h6 class="name">{{ item.name }}</h6>

            <p class="price">{{ item.price.toLocaleString() }} ₫</p>

            <RouterLink class="btn-buy" :to="`/products/${item.id}`">
              <i class="bi bi-cart me-2"></i> Đặt mua
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
/* === CARD CHUNG === */
.home-card {
  border-radius: 12px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #f1f1f1;
  transition: all 0.25s ease;
  cursor: pointer;
  text-align: center;
}

.home-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
}

/* === IMAGE WRAPPER === */
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

.product-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.no-image {
  color: #bbb;
  font-size: 14px;
}

/* === INFO === */
.info {
  margin-top: 12px;
}

.name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
  min-height: 40px;
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
  text-decoration: none; /* Bỏ gạch chân */
  transition: 0.2s ease;
}

.btn-buy:hover {
  background-color: #ffb000;
  transform: scale(1.03);
  text-decoration: none; /* đảm bảo hover không bị underline */
}
</style>
