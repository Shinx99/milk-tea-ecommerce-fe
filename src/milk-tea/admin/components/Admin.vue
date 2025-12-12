<script setup>
import { useRoute } from "vue-router";
const route = useRoute();

const adminMenuItems = [
  { name: "CATEGORIES", routeName: "admin-categories", icon: "fa-layer-group" },
  { name: "PRODUCT", routeName: "admin-products", icon: "fa-boxes-stacked" },
  { name: "ORDER", routeName: "admin-orders", icon: "fa-receipt" },
  { name: "CUSTOMER", routeName: "admin-customers", icon: "fa-users" },
  {
    name: "ADDRESS",
    routeName: "admin-addresses",
    icon: "fa-map-location-dot",
  },
  { name: "VOUCHER", routeName: "admin-vouchers", icon: "fa-tags" },
  { name: "STATISTICS", routeName: "admin-statistics", icon: "fa-chart-bar" },
];

const isLinkActive = (routeName) => {
  return route.name === routeName;
};
</script>

<template>
  <div class="fixed-sidebar shadow-sm p-3 flex-shrink-0">
    <div class="sidebar-logo text-center mb-4">
      <h3 class="fw-bold text-primary">ADMIN PANEL</h3>
      <hr class="mt-0" />
    </div>
    <ul class="list-unstyled admin-menu mb-0">
      <router-link
        v-for="item in adminMenuItems"
        :key="item.routeName"
        :to="{ name: item.routeName }"
        custom
        v-slot="{ navigate }"
      >
        <li
          :class="['menu-item', { active: isLinkActive(item.routeName) }]"
          @click="navigate"
        >
          <i :class="['fa-solid', item.icon, 'me-3 fa-fw']"></i>
          {{ item.name }}
        </li>
      </router-link>
    </ul>
  </div>
</template>

<style scoped>
/* CSS cho Sidebar Fixed */
.fixed-sidebar {
  width: 250px; /* Chiều rộng cố định cho Sidebar */
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #fff;
  border-right: 1px solid #eee;
  padding-top: 20px !important;
  z-index: 1020;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.admin-menu {
  padding-top: 10px;
}

.menu-item {
  padding: 12px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s ease;
  font-weight: 500;
  color: #444;
  margin-bottom: 4px;
  font-size: 1em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
}

.menu-item:hover {
  background: #f3f3f3;
}

.menu-item.active {
  background: #ffca2c;
  color: #000;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
