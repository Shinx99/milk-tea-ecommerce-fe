// src/milk-tea/product/data/products.js

// import ảnh trực tiếp
import imgTT from '@/assets/images/tra-sua-truyen-thong.jpg'
import imgMatcha from '@/assets/images/tra-sua-matcha.jpg'
import imgHongTra from '@/assets/images/hong-tra-sua.jpg'
import imgDao from '@/assets/images/tra-dao-cam-sa.jpg'
import imgVai from '@/assets/images/tra-vai.jpg'

export const seedProducts = [
  {
    id: 101,
    name: 'Trà Sữa Truyền Thống',
    price: 30000,
    category: 'Milk Tea',
    image: imgTT,
    desc: 'Vị trà đậm, béo nhẹ, hợp khẩu vị số đông.',
    salesCount: 0
  },
  {
    id: 102,
    name: 'Trà Sữa Matcha',
    price: 35000,
    category: 'Milk Tea',
    image: imgMatcha,
    desc: 'Matcha thanh mát, hậu vị thơm.',
    salesCount: 0
  },
  {
    id: 103,
    name: 'Hồng Trà Sữa',
    price: 32000,
    category: 'Milk Tea',
    image: imgHongTra,
    desc: 'Hồng trà cân bằng vị sữa.',
    salesCount: 0
  },
  {
    id: 201,
    name: 'Trà Đào Cam Sả',
    price: 39000,
    category: 'Fruit Tea',
    image: imgDao,
    desc: 'Đào ngọt dịu, sả the nhẹ, giải khát.',
    salesCount: 0
  },
  {
    id: 202,
    name: 'Trà Vải',
    price: 36000,
    category: 'Fruit Tea',
    image: imgVai,
    desc: 'Hương vải dịu nhẹ, rất dễ uống.',
    salesCount: 0
  }
]
