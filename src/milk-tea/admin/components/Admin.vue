<script setup>
import { useRoute } from "vue-router";
const route = useRoute();

// Định nghĩa các mục menu và tên Route tương ứng
// Tên routeName PHẢI KHỚP chính xác với tên đã khai báo trong router.js
const adminMenuItems = [
    { name: "CATEGORIES", routeName: "admin-categories" },
    { name: "CUSTOMER", routeName: "admin-customers" },
    { name: "ORDER", routeName: "admin-orders" },
    { name: "PRODUCT", routeName: "admin-products" },
    { name: "VOUCHER", routeName: "admin-vouchers" },
    { name: "STATISTICS", routeName: "admin-statistics" },
];

// Hàm kiểm tra mục nào đang active dựa trên tên route hiện tại
const isLinkActive = (routeName) => {
    return route.name === routeName;
};
</script>

<template>
    <div class="sidebar shadow-sm p-3 rounded flex-shrink-0">
        <ul class="list-unstyled admin-menu mb-0">
            <router-link v-for="item in adminMenuItems" :key="item.routeName" :to="{ name: item.routeName }" custom
                v-slot="{ navigate }">

                <li :class="['menu-item', { active: isLinkActive(item.routeName) }]" @click="navigate">
                    {{ item.name }}
                </li>
            </router-link>
        </ul>
    </div>
</template>

<style scoped>
/* CSS Đơn giản: Đảm bảo chỉ có màu vàng cho mục active */
.sidebar {
    width: 100%;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
}

.menu-item {
    padding: 12px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: 0.2s ease;
    font-weight: 500;
    color: #444;
    margin-bottom: 2px;
    font-size: 1.1em;
    text-transform: uppercase;
}

.menu-item:hover {
    background: #f3f3f3;
}

.menu-item.active {
    background: #ffca2c;
    /* Màu vàng cam */
    color: #000;
    font-weight: 600;
}
</style>