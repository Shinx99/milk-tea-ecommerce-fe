// src/milk-tea/home/store.js
import { reactive } from "vue";

export const homeState = reactive({
  bestSellers: [],
  newest: [],
});

export async function loadHomeData() {
  try {
    const [bestSellers, newest] = await Promise.all([
      fetch("http://localhost:8080/api/home/best-sellers?limit=8").then((r) =>
        r.json()
      ),
      fetch("http://localhost:8080/api/home/newest?limit=8").then((r) =>
        r.json()
      ),
    ]);

    homeState.bestSellers = bestSellers;
    homeState.newest = newest;
  } catch (err) {
    console.error("Lỗi tải dữ liệu trang chủ:", err);
  }
}
