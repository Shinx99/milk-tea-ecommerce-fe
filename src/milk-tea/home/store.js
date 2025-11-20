// src/milk-tea/home/store.js
import { reactive } from "vue";
import { fetchHomeSection } from "@milk-tea/home/service/homeService.js";

export const homeState = reactive({
  bestSellers: [],
  newest: [],
});

export async function loadHomeData() {
  try {
    const [bestSellers, newest] = await Promise.all([
      fetchHomeSection('best-sellers', {page:0, size:8}),
      fetchHomeSection('newest', {page:0, size:8}),
    ]);

    homeState.bestSellers = bestSellers;
    homeState.newest = newest;
  } catch (err) {
    console.error("Lỗi tải dữ liệu trang chủ:", err);
  }
}
