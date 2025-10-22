import { createApp } from "vue";
import { createPinia } from 'pinia'
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { useUserStore } from "@/milk-tea/account/store";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

const app = createApp(App);
// 1. Tạo instance Pinia
const pinia = createPinia();

// 2. Sử dụng Pinia (để app biết về Pinia)
app.use(pinia); 
app.use(router);

// 3. Gọi restore() để tải token từ localStorage
try {
  // Khi gọi store bên ngoài component cần truyền 'pinia' instance
  const userStore = useUserStore(pinia); 
  userStore.restore();
} catch (e) {
  console.error("Không thể khôi phục phiên đăng nhập:", e);
}

app.mount("#app");
