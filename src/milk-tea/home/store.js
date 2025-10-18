import { reactive } from "vue";

export const homeState = reactive({
  // banners: [
  //   { id: 1, image: new URL("@/assets/images/banner1.png", import.meta.url).href },
  //   { id: 2, image: new URL("@/assets/images/banner2.png", import.meta.url).href },
  //   { id: 3, image: new URL("@/assets/images/banner3.png", import.meta.url).href },
  // ],
  bestSellerMilkTea: [],
  bestSellerFruitTea: [],
  newest: [],
});

export async function loadHomeData() {
  try {
    const [milk, fruit, newest] = await Promise.all([
      fetch("http://localhost:8080/api/home/best-sellers?parent=Milk%20Tea&limit=8").then(r => r.json()),
      fetch("http://localhost:8080/api/home/best-sellers?parent=Fruit%20Tea&limit=8").then(r => r.json()),
      fetch("http://localhost:8080/api/home/newest?limit=8").then(r => r.json()),
    ]);

    homeState.bestSellerMilkTea = milk;
    homeState.bestSellerFruitTea = fruit;
    homeState.newest = newest;
  } catch (err) {
    console.error("Lỗi tải dữ liệu trang chủ:", err);
  }
}
