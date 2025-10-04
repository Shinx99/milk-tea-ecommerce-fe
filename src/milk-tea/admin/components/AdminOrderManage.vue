<template>
  <div class="container">
    <nav>
      <div class="nav nav-tabs" role="tablist">
        <!-- Tabs giữ nguyên -->
        <button
          class="nav-link"
          :class="{ active: activeTab === 'list' }"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'list'"
          @click="switchTab('list')"
        >
          Orders List
        </button>
        <button
          class="nav-link"
          :class="{ active: activeTab === 'detail' }"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'detail'"
          @click="switchTab('detail')"
        >
          Orders Detail
        </button>
        
      </div>
    </nav>

    <div class="tab-content">
      <!-- Tab list hóa đơn -->
      <div class="tab-pane" :class="{ 'show active': activeTab === 'list', fade: activeTab !== 'list' }" role="tabpanel">
        <table class="table table-hover" border="1">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên khách hàng</th>
              <th>Status</th>
              <th>Placed At</th>
              <th>Voucher</th>
              <th>Subtotal</th>
              <th>Discount Total</th>
              <th>Tax Total</th>
              <th>Shipping Fee</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(o, index) in orders"
              :key="o.id"
              style="cursor: pointer"
              @click="showDetail(o)">
              <td>{{ index + 1 }}</td>
              <td>{{ o.customer_name }}</td>
              <td>{{ o.status }}</td>
              <td>{{ o.placed_at }}</td>
              <td>{{ o.voucher || "-" }}</td>
              <td>{{ o.subtotal }}</td>
              <td>{{ o.discount_total }}</td>
              <td>{{ o.tax_total }}</td>
              <td>{{ o.shipping_fee }}</td>
              <td>{{ o.total }}</td>
            </tr>
            <tr v-if="orders.length === 0">
              <td colspan="10" class="text-center">Không có đơn hàng</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tab chi tiết hóa đơn -->
      <div class="mt-2 tab-pane" :class="{ 'show active': activeTab === 'detail', fade: activeTab !== 'detail' }" role="tabpanel">
        <div v-if="selectedOrder">
          <div class="row">
            <div class="col-sm-5">
              <table class="table table-bordered mt-3 w-100">
                <tr>
                  <th>Mã hóa đơn:</th>
                  <td>{{ selectedOrder.id }}</td>
                </tr>
                <tr>
                  <th>Tên khách hàng:</th>
                  <td>{{ selectedOrder.customer_name }}</td>
                </tr>
                <tr>
                  <th>Thời gian đặt:</th>
                  <td>{{ selectedOrder.placed_at }}</td>
                </tr>
                <tr>
                  <th>Trạng thái:</th>
                  <td>{{ selectedOrder.status }}</td>
                </tr>
                <tr>
                  <th>Voucher:</th>
                  <td>{{ selectedOrder.voucher }}</td>
                </tr>
                <tr>
                  <th>Tổng sản phẩm:</th>
                  <td>{{ selectedOrder.subtotal }}</td>
                </tr>
                <tr>
                  <th>Giảm giá:</th>
                  <td>{{ selectedOrder.discount_total }}</td>
                </tr>
                <tr>
                  <th>Thuế:</th>
                  <td>{{ selectedOrder.tax_total }}</td>
                </tr>
                <tr>
                  <th>Phí ship:</th>
                  <td>{{ selectedOrder.shipping_fee }}</td>
                </tr>
                <tr>
                  <th>Tổng tiền:</th>
                  <td>{{ selectedOrder.total }}</td>
                </tr>
                <tr>
                  <th>Mô tả:</th>
                  <td>{{ selectedOrder.description }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-7">
              <h6>Chi tiết sản phẩm trong hóa đơn</h6>
              <table class="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in orderItems" :key="item.id">
                    <td>{{ idx + 1 }}</td>
                    <td>{{ item.product_name }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.price.toLocaleString() }}</td>
                    <td>{{ item.line_total.toLocaleString() }}</td>
                  </tr>
                  <tr v-if="orderItems.length === 0">
                    <td colspan="5" class="text-center">Không có sản phẩm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else class="mt-3">Chọn một hóa đơn để xem chi tiết</div>
      </div>

      
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useOrderStore } from "@/milk-tea/admin/store/AdminOrderManage.js";

const orderStore = useOrderStore();

const activeTab = ref("list");
const orders = ref([]);
const selectedOrder = ref(null);
// Dùng orderItems trong store thay cho local ref
const orderItems = orderStore.orderItems;

// Load danh sách orders khi mount
orderStore.loadOrders();

// Đồng bộ orders
watchEffect(() => {
  orders.value = orderStore.orders.value;
});

// Khi chọn hóa đơn, set selected và gọi hàm load chi tiết từ store luôn
async function showDetail(order) {
  selectedOrder.value = order;
  activeTab.value = "detail";
  await orderStore.loadOrderItems(order.id); // load chi tiết trong store
}

function switchTab(tab) {
  activeTab.value = tab;
}
</script>

