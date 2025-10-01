// src/milk-tea/home/data/home.js
import banner1 from "@/assets/images/banner1.png";
import banner2 from "@/assets/images/banner2.png";
import banner3 from "@/assets/images/banner3.png";

import cake1 from "@/assets/images/tra-sua-matcha.jpg";
import cake2 from "@/assets/images/tra-sua-matcha.jpg";

import drink1 from "@/assets/images/tra-sua-matcha.jpg";
import drink2 from "@/assets/images/tra-sua-matcha.jpg";

import milk1 from "@/assets/images/tra-sua-matcha.jpg";
import milk2 from "@/assets/images/tra-sua-matcha.jpg";

import promo1 from "@/assets/images/tra-sua-matcha.jpg";
import promo2 from "@/assets/images/tra-sua-matcha.jpg";

export const seedHome = {
  banners: [
    {
      id: 1,
      image: banner1,
      title: "Trà sữa thơm ngon",
      subtitle: "Hương vị truyền thống",
    },
    {
      id: 2,
      image: banner2,
      title: "Matcha tươi mát",
      subtitle: "Nguyên liệu tự nhiên",
    },
    {
      id: 3,
      image: banner3,
      title: "Dịch vụ tận tâm",
      subtitle: "Giao hàng nhanh chóng",
    },
  ],
  collections: [
    { id: 1, name: "Bánh Ô Long Quế Hoa", price: 80000, image: cake1 },
    { id: 2, name: "Bánh Tiramisu Cà Phê", price: 85000, image: cake2 },
  ],
  bestSellerTea: [
    { id: 1, name: "Hồng Trà Đào (L)", price: 55000, image: drink1 },
    { id: 2, name: "Trà Vải Lài (L)", price: 65000, image: drink2 },
  ],
  bestSellerMilk: [
    { id: 1, name: "Trà Sữa Phúc Long (L)", price: 50000, image: milk1 },
    { id: 2, name: "Trà Sữa Ô Long (L)", price: 52000, image: milk2 },
  ],
  promotions: [
    { id: 1, title: "Đậm cuối kẻ - Save the date", image: promo1, views: 6655 },
    { id: 2, title: "Ưu đãi hội viên - Giảm 50%", image: promo2, views: 13673 },
    { id: 1, title: "Đậm cuối kẻ - Save the date", image: promo1, views: 6655 },
    { id: 2, title: "Ưu đãi hội viên - Giảm 50%", image: promo2, views: 13673 },
  ],
};
