// src/views/admin/router.js (Cấu hình Route cho Khu vực Admin)

// Import Layout chính (AdminLayout chứa Sidebar)
import AdminLayout from './components/AdminLayout.vue'

// Import các Views/Components quản lý (được đặt trong thư mục components)
import Category from './components/AdminCategoryManage.vue'
import Customer from './components/AdminCustomerManage.vue' 
import Order from './components/AdminOrderManage.vue'
import Product from './components/AdminProductManage.vue'
import Statistics from './components/AdminStatistics.vue'
import Voucher from './components/AdminVoucherManage.vue'

// Import Trang Dashboard mặc định
import AdminDashboardView from './views/AdminDashboardView.vue'

export default [
    {
        path: '/admin',
        component: AdminLayout, // Sử dụng bố cục 2 cột (Sidebar + Nội dung)
        
        // Định nghĩa các Route con (sẽ hiển thị trong <router-view> của AdminLayout)
        children: [
            // 1. Trang Mặc Định (Dashboard) - Truy cập bằng /admin
            { 
                path: '', 
                name: 'admin-home', 
                component: AdminDashboardView 
            },
            
            // 2. Quản lý Danh mục - Truy cập bằng /admin/categories
            { 
                path: 'categories', 
                name: 'admin-categories', 
                component: Category 
            },
            
            // 3. Quản lý Khách hàng - Truy cập bằng /admin/customers
            { 
                path: 'customers', 
                name: 'admin-customers', 
                component: Customer 
            },
            
            // 4. Quản lý Đơn hàng - Truy cập bằng /admin/orders
            { 
                path: 'orders', 
                name: 'admin-orders', 
                component: Order 
            },
            
            // 5. Quản lý Sản phẩm - Truy cập bằng /admin/products
            { 
                path: 'products', 
                name: 'admin-products', 
                component: Product 
            },
            
            // 6. Quản lý Thống kê - Truy cập bằng /admin/statistics
            { 
                path: 'statistics', 
                name: 'admin-statistics', 
                component: Statistics 
            },
            
            // 7. Quản lý Voucher - Truy cập bằng /admin/vouchers
            { 
                path: 'vouchers', 
                name: 'admin-vouchers', 
                component: Voucher 
            }
        ]
    }
]