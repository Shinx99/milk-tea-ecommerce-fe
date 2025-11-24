<template>
  <main class="store-view">
    <header class="page-header">
      <h1>Danh sách cửa hàng MilkTea tại Việt Nam</h1>
    </header>

    <!-- Bộ chọn thành phố -->
    <nav class="city-selector" aria-label="Chọn tỉnh/thành">
      <div class="city-track" role="list">
        <button
          v-for="city in cities"
          :key="city"
          role="listitem"
          @click="selectCity(city)"
          :class="['city-btn', { active: city === selectedCity }]"
          aria-pressed="city === selectedCity"
        >
          🏙️ {{ city }}
        </button>
      </div>
    </nav>

    <!-- Danh sách cửa hàng -->
    <section class="store-list" aria-label="Danh sách cửa hàng">
      <article
        v-for="store in filteredStores"
        :key="store.name"
        class="store-card"
      >
        <h2 class="store-title">{{ store.name }}</h2>
        <p><strong>Địa chỉ:</strong> {{ store.address }}</p>
        <p>
          <strong>Điện thoại:</strong>
          <a :href="`tel:${store.tel.replace(/\\s+/g, '')}`">{{ store.tel }}</a>
        </p>
        <p><strong>Giờ mở cửa:</strong> {{ store.open }}</p>
        <a
          :href="store.mapLink"
          target="_blank"
          rel="noopener noreferrer"
          class="map-link"
        >
          Xem trên Google Map
        </a>
      </article>

      <p v-if="filteredStores.length === 0" class="empty-state">
        Hiện chưa có cửa hàng tại khu vực này.
      </p>
    </section>
  </main>
</template>

<script>
export default {
  name: "StoreView",
  data() {
    return {
      selectedCity: "Hồ Chí Minh",
      cities: ["Hồ Chí Minh", "Hà Nội"],
      stores: [
        {
          city: "Hồ Chí Minh",
          name: "MilkTea Phan Xích Long",
          address:
            "94 Phan Xích Long, Phường 3, Quận Phú Nhuận, TP. Hồ Chí Minh",
          tel: "028 6650 1179",
          open: "10:00 - 22:30",
          mapLink: "https://maps.google.com/?q=94+Phan+Xich+Long",
        },
        {
          city: "Hồ Chí Minh",
          name: "MilkTea Nguyễn Đức Cảnh",
          address:
            "8 Nguyễn Đức Cảnh, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh",
          tel: "028 6650 1179",
          open: "10:00 - 22:30",
          mapLink: "https://maps.google.com/?q=8+Nguyen+Duc+Canh",
        },
        // Hà Nội
        {
          city: "Hà Nội",
          name: "MilkTea Tràng Tiền",
          address: "26 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội",
          tel: "024 6650 1179",
          open: "09:00 - 22:00",
          mapLink: "https://maps.google.com/?q=26+Trang+Tien+Ha+Noi",
        },
        {
          city: "Hà Nội",
          name: "MilkTea Cầu Giấy",
          address: "123 Cầu Giấy, Quận Cầu Giấy, Hà Nội",
          tel: "024 6650 1180",
          open: "09:00 - 22:00",
          mapLink: "https://maps.google.com/?q=123+Cau+Giay+Ha+Noi",
        },
      ],
    };
  },
  computed: {
    filteredStores() {
      return this.stores.filter((s) => s.city === this.selectedCity);
    },
  },
  methods: {
    selectCity(city) {
      this.selectedCity = city;
    },
  },
};
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

:root {
  --primary-green: #00754a;
  --secondary-green: #009e60;
  --hover-green: #005f3a;
  --light-green: #f7fbf9;
  --border: #d9d9d9;
  --text: #2f2f2f;
  --muted: #6b6b6b;
}

.store-view {
  font-family: "Segoe UI", sans-serif;
  color: var(--text);
  background: var(--light-green);
  padding: 24px;
  display: grid;
  place-items: start;
}

.page-header {
  max-width: 1100px;
  margin: 0 auto 16px;
  padding: 0 8px;
}

.page-header h1 {
  color: var(--primary-green);
  font-size: 1.9rem;
  margin-bottom: 8px;
}

.page-header p {
  color: var(--muted);
  margin-bottom: 8px;
}

/* City Selector */
.city-selector {
  max-width: 1100px;
  margin: 0 auto 20px;
  padding: 0 8px;
}

.city-track {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

@media (max-width: 640px) {
  .city-track {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 6px;
  }
  .city-track::-webkit-scrollbar {
    height: 6px;
  }
  .city-track::-webkit-scrollbar-thumb {
    background: #c7e3d6;
    border-radius: 999px;
  }
}

.city-btn {
  background: linear-gradient(
    135deg,
    var(--secondary-green),
    var(--primary-green)
  );
  color: green;
  border: 1px solid transparent;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  white-space: nowrap;
}

.city-btn:hover {
  background: linear-gradient(135deg, var(--primary-green), var(--hover-green));
  transform: translateY(-1.5px);
  border-color: var(--secondary-green);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
}

.city-btn.active {
  background: var(--hover-green);
  border-color: var(--secondary-green);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.14);
}

.store-list {
  display: flex;
  flex-direction: column; /* xếp dọc */
  gap: 20px;
  width: 100%; /* chiếm toàn bộ chiều ngang */
}

.store-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  width: 100%; /* chiếm hết chiều ngang */
  min-height: 180px; /* chiều cao tối thiểu để đồng bộ */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.25s ease;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.store-card:hover {
  border-color: var(--secondary-green);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.store-title {
  color: var(--primary-green);
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.store-card p {
  font-size: 1rem;
  margin: 4px 0;
}

.map-link {
  color: var(--primary-green);
  text-decoration: underline;
  font-weight: 600;
  margin-top: auto;
}

.empty-state {
  color: var(--muted);
  padding: 12px;
  border: 1px dashed var(--border);
  border-radius: 12px;
  background: #ffffffc2;
}
</style>
