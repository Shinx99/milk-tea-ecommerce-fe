<script setup>
// Admin.vue chính là component Sidebar Menu
import AdminSidebar from "./Admin.vue"; 
</script>

<template>
    <div class="container-fluid py-4">
        <div class="row g-4 admin-wrapper">
            <div class="col-lg-3 col-md-4">
                <h2 class="fw-bold mb-4 text-center text-primary">ADMIN PANEL</h2>
                <AdminSidebar />
            </div>

            <div class="col-lg-9 col-md-8">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-wrapper {
    align-items: flex-start;
}
</style>