<template>
  <footer class="footer text-white">
    <!-- Phần chính -->
    <div class="container py-5">
      <div class="row gy-4">
        <!-- Cột 1: Địa chỉ & công ty -->
        <div class="col-md-4">
          <h6 class="fw-bold mb-3">ĐỊA CHỈ</h6>
          <p class="small mb-1">
            <strong>Trụ sở chính:</strong> Công ty Milk Tea Việt Nam
          </p>
          <p class="small mb-1">123 Đường ABC, Quận 1, TP.HCM</p>
          <p class="small mb-1"><strong>Hotline Đặt hàng:</strong> 1800 1234</p>
          <p class="small mb-1"><strong>Hotline CSKH:</strong> 1900 5678</p>
          <p class="small mb-1">
            Email:
            <a href="mailto:marketing@milktea.vn" class="footer-link"
              >marketing@milktea.vn</a
            >
          </p>
        </div>

        <!-- Cột 2: Công ty -->
        <div class="col-md-2">
          <h6 class="fw-bold mb-3">CÔNG TY</h6>
          <ul class="list-unstyled small">
            <li>
              <RouterLink to="/about" class="footer-link"
                >Giới thiệu</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/news" class="footer-link">Tin tức</RouterLink>
            </li>
            <li>
              <RouterLink to="/contact" class="footer-link">Liên hệ</RouterLink>
            </li>
            <li>
              <RouterLink to="/store" class="footer-link"
                >Hệ thống cửa hàng</RouterLink
              >
            </li>
          </ul>
        </div>

        <!-- Cột 3: Khách hàng -->
        <div class="col-md-2">
          <h6 class="fw-bold mb-3">KHÁCH HÀNG</h6>
          <ul class="list-unstyled small">
            <li>
              <RouterLink to="/review" class="footer-link">Đánh giá</RouterLink>
            </li>
            <li><RouterLink to="/faq" class="footer-link">FAQ</RouterLink></li>
            <li>
              <RouterLink to="/policy" class="footer-link"
                >Chính sách</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/promotion" class="footer-link"
                >Khuyến mãi</RouterLink
              >
            </li>
          </ul>
        </div>

        <!-- Cột 4: Điều khoản -->
        <div class="col-md-2">
          <h6 class="fw-bold mb-3">ĐIỀU KHOẢN</h6>
          <ul class="list-unstyled small">
            <li>
              <RouterLink to="/terms" class="footer-link"
                >Điều khoản sử dụng</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/privacy" class="footer-link"
                >Chính sách bảo mật</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/shipping" class="footer-link"
                >Chính sách giao hàng</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/refund" class="footer-link"
                >Chính sách đổi trả</RouterLink
              >
            </li>
          </ul>
        </div>

        <!-- Cột 5: Social -->
        <div class="col-md-2">
          <h6 class="fw-bold mb-3">KẾT NỐI</h6>
          <div class="d-flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              class="footer-social"
              aria-label="Facebook"
            >
              <i class="fab fa-facebook fa-lg"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              class="footer-social"
              aria-label="Instagram"
            >
              <i class="fab fa-instagram fa-lg"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              class="footer-social"
              aria-label="YouTube"
            >
              <i class="fab fa-youtube fa-lg"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Dải cuối -->
    <div class="footer-bottom text-center py-3 small">
      © 2025 Milk Tea. All Rights Reserved.
    </div>
  </footer>
</template>

<script setup>
// Footer chia 5 cột: Địa chỉ | Công ty | Khách hàng | Điều khoản | Social
</script>

<style scoped>
.footer {
  background-color: #004d40; /* xanh đậm kiểu Phúc Long, có thể đổi sang nâu sữa brand */
}
.footer-link {
  color: #e0e0e0;
  text-decoration: none;
}
.footer-link:hover {
  color: #ffd54f;
  text-decoration: underline;
}
.footer-social {
  color: #e0e0e0;
  transition: color 0.3s;
}
.footer-social:hover {
  color: #ffd54f;
}
.footer-bottom {
  background-color: #00332d;
  color: #ccc;
}
</style>
