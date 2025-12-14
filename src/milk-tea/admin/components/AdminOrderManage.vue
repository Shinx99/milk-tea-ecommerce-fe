<template>
  <h3 class="mb-4 fw-bolder text-primary">
    <i class="fa-solid fa-receipt me-2"></i>
    Quản lý Đơn hàng
  </h3>

  <div class="container">
    <div class="card shadow-sm border-0">
      <!-- Header: Search + badge -->
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <div style="max-width: 350px; width: 100%;">
          <input
            v-model="orderState.keyword"
            type="search"
            class="form-control"
            placeholder="Tìm đơn hàng (tên KH / email / mã đơn / trạng thái)..."
          />
        </div>

        <!--Filter status-->
        <div class="btn-group ms-3" role="group" aria-label="Filter status">
  <button class="btn btn-outline-primary"
          :class="{ active: !orderState.status }"
          @click="setStatus('')">
    Tất cả
  </button>

  <button class="btn btn-outline-primary"
          :class="{ active: orderState.status === 'paid' }"
          @click="setStatus('paid')">
    Đã thanh toán
  </button>

  <button class="btn btn-outline-primary"
          :class="{ active: orderState.status === 'processing' }"
          @click="setStatus('processing')">
    Đang làm
  </button>

  <button class="btn btn-outline-primary"
          :class="{ active: orderState.status === 'completed' }"
          @click="setStatus('completed')">
    Đã hoàn thành
  </button>
</div>


        <div class="d-flex align-items-center gap-2 ms-3">
          <span class="badge bg-primary-subtle text-primary-emphasis">
            {{ orderState.totalElements }} đơn hàng
          </span>
        </div>
      </div>

      <!-- Body: bảng + phân trang -->
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover table-striped align-middle mb-0">
            <thead class="table-primary text-white">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên khách hàng</th>
                <th scope="col">Email</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Thời gian đặt</th>
                <th scope="col">Tạm tính</th>
                <th scope="col">Giảm giá</th>
                <th scope="col">Thuế</th>
                <th scope="col">Tổng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="orders.length === 0">
                <td colspan="10" class="text-center text-muted py-4">
                  Không có đơn hàng
                </td>
              </tr>

              <tr
                v-for="(o, index) in orders"
                :key="o.id"
                class="cursor-pointer"
                @dblclick="showDetail(o)"
              >
                <td class="fw-bold">{{ index + 1 }}</td>
                <td>{{ o.fullname }}</td>
                <td>{{ o.email }}</td>
                <td>{{ o.status }}</td>
                <td>{{ formatDate(o.placedAt) }}</td>
                <td>{{ o.subtotal }}</td>
                <td>{{ o.discountTotal }}</td>
                <td>{{ o.taxTotal }}</td>
                <td>{{ o.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <nav
          v-if="!orderState.isLoading && orderState.totalPages > 0"
          aria-label="Page navigation"
          class="mt-4"
        >
          <ul class="pagination justify-content-center align-items-center">
            <li class="page-item" :class="{ disabled: orderState.page === 0 }">
              <button
                class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
                @click.prevent="prevPage"
                :disabled="orderState.page === 0"
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo; Trước</span>
              </button>
            </li>

            <li class="page-item disabled">
              <span class="page-link text-dark fw-bold border-0 bg-transparent">
                Trang {{ orderState.page + 1 }} / {{ orderState.totalPages }}
              </span>
            </li>

            <li
              class="page-item"
              :class="{ disabled: orderState.page >= orderState.totalPages - 1 }"
            >
              <button
                class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0"
                @click.prevent="nextPage"
                :disabled="orderState.page >= orderState.totalPages - 1"
                aria-label="Next"
              >
                <span aria-hidden="true">Sau &raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Modal chi tiết đơn -->
      <div
        v-if="isDetailModalOpen"
        class="modal fade show"
        style="display: block; background: rgba(0,0,0,0.5);"
        tabindex="-1"
        role="dialog"
      >
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                Chi tiết đơn: {{ selectedOrder.orderCode }}
              </h5>
              <button type="button" class="btn-close" @click="closeDetailModal"></button>
            </div>

            <div class="modal-body">
              <div class="row">
                <!-- Thông tin đơn -->
                <div class="col-sm-5">
                  <table class="table table-bordered w-100 mb-0">
                    <tbody>
                      <tr>
                        <th>Mã hóa đơn:</th>
                        <td>{{ selectedOrder.orderCode }}</td>
                      </tr>
                      <tr>
                        <th>Email:</th>
                        <td>{{ selectedOrder.email }}</td>
                      </tr>
                      <tr>
                        <th>Tên khách hàng:</th>
                        <td>{{ selectedOrder.fullname }}</td>
                      </tr>
                      <tr>
                        <th>So dien thoai:</th>
                        <td>{{ selectedOrder.phone }}</td>
                      </tr>
                      <tr>
                        <th>Thời gian đặt:</th>
                        <td>{{ formatDate(selectedOrder.placedAt) }}</td>
                      </tr>
                      <tr>
                        <th>Trạng thái:</th>
                        <td>{{ selectedOrder.status }}</td>
                      </tr>
                      <tr>
                        <th>Tổng sản phẩm:</th>
                        <td>{{ selectedOrder.subtotal }}</td>
                      </tr>
                      <tr>
                        <th>Giảm giá:</th>
                        <td>{{ selectedOrder.discountTotal }}</td>
                      </tr>
                      <tr>
                        <th>Thuế:</th>
                        <td>{{ selectedOrder.taxTotal }}</td>
                      </tr>
                      <tr>
                        <th>Tổng tiền:</th>
                        <td>{{ selectedOrder.total }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Chi tiết sản phẩm -->
                <div class="col-sm-7">
                  <h6 class="fw-bold mb-2">Chi tiết sản phẩm trong hóa đơn</h6>
                  <div class="table-responsive">
                    <table class="table table-bordered table-sm mb-0">
                      <thead class="table-light">
                        <tr>
                          <th>STT</th>
                          <th>Sản phẩm</th>
                          <th>Số lượng</th>
                          <th>Đơn giá</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="!selectedOrder.items || selectedOrder.items.length === 0">
                          <td colspan="5" class="text-center text-muted py-3">
                            Không có sản phẩm
                          </td>
                        </tr>
                        <tr v-for="(item, idx) in selectedOrder.items || []" :key="item.id">
                          <td>{{ idx + 1 }}</td>
                          <td>{{ item.productName }}</td>
                          <td>{{ item.quantity }}</td>
                          <td>{{ item.price.toLocaleString() }}</td>
                          <td>{{ item.lineTotal.toLocaleString() }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeDetailModal">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import {
  orderState,
  loadOrder,
  changePage, nextPage, prevPage
} from "../composables/UseOrder.js";

import { connectOrderSocket, disconnectOrderSocket } from "@/shared/service/orderSocket.js"; 

import { onOrderPaid } from "@/shared/state/orderNotifyState";

const paidAudio = new Audio("/sounds/order-paid.wav");
paidAudio.preload = "auto";

onMounted(async () => {
  await loadOrder();

connectOrderSocket(async (dto) => {
  console.log("WS order notification:", dto);

  const isPaid =
    dto?.type === "ORDER_PAID" || String(dto?.status || "").toUpperCase() === "PAID";

  if (isPaid) {
    onOrderPaid(dto); // cập nhật biến chung (badge)
    paidAudio.currentTime = 0;
    paidAudio.play().catch((e) => {
      console.warn("Audio blocked by autoplay policy:", e);
    });
  }

  await loadOrder();
});


});

onUnmounted(() => {
  disconnectOrderSocket();
});


const orders = computed(() => orderState.list);

const isDetailModalOpen = ref(false);

orderState.searchTimeout = null;

watch(
  () => orderState.keyword,
  () => {
    if (orderState.searchTimeout) {
      clearTimeout(orderState.searchTimeout);
    }
    orderState.searchTimeout = setTimeout(() => {
      orderState.page = 0;
      loadOrder();
    }, 100);
  }
);

const selectedOrder = ref({
  orderCode: "",
  email: "",
  fullname: "",
  phone: "",
  productName: "",
  subtotal: 0,
  discountTotal: 0,
  total: 0,
  status: "",
  placedAt: "",
  taxTotal: 0,
  items: []
});

async function showDetail(order) {
  selectedOrder.value = order;
  isDetailModalOpen.value = true;
}

function closeDetailModal() {
  isDetailModalOpen.value = false;
}

function setStatus(newStatus) {
  orderState.status = newStatus;
  orderState.page = 0;
  loadOrder();
}


//Format createdAt va updatedAt theo dd/MM//yyyy
function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit", // bật dòng này nếu muốn hiện giây
    hour12: false,
  });
}

</script>
