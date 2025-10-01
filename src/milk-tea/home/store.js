// src/milk-tea/home/store.js
import { reactive } from "vue";
import { seedHome } from "./data/home";

export const homeState = reactive({
  banners: [...seedHome.banners],
  collections: [...seedHome.collections],
  bestSellerTea: [...seedHome.bestSellerTea],
  bestSellerMilk: [...seedHome.bestSellerMilk],
  promotions: [...seedHome.promotions],
});

export function resetHome() {
  homeState.banners = [...seedHome.banners];
  homeState.collections = [...seedHome.collections];
  homeState.bestSellerTea = [...seedHome.bestSellerTea];
  homeState.bestSellerMilk = [...seedHome.bestSellerMilk];
  homeState.promotions = [...seedHome.promotions];
}
