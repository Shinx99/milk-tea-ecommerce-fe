<template>
  <div class="container my-5">
    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="spinner-border text-success me-2" role="status"></div>
      <span class="align-self-center">Đang kiểm tra trạng thái thanh toán...</span>
    </div>

    <!-- Result -->
    <div v-else class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div
          class="card shadow-sm border-0"
          :class="payment && payment.paymentStatus === 'SUCCESS'
                    ? 'border-success'
                    : 'border-danger'"
        >
          <div
            class="card-header text-center text-white"
            :class="payment && payment.paymentStatus === 'SUCCESS'
                      ? 'bg-success'
                      : 'bg-danger'"
          >
            <h4 class="mb-0">
              {{ payment && payment.paymentStatus === 'SUCCESS'
                  ? 'Thanh toán thành công'
                  : 'Thanh toán không thành công' }}
            </h4>
          </div>

          <div class="card-body">
            <!-- Có dữ liệu payment -->
            <template v-if="payment">
              <p class="text-muted text-center mb-4">
                Mã đơn: <strong>{{ payment.orderCode }}</strong>
              </p>

              <ul class="list-group list-group-flush mb-3">
                <li class="list-group-item d-flex justify-content-between">
                  <span>Số tiền</span>
                  <strong>{{ money(payment.amount) }} đ</strong>
                </li>
                <li
                  class="list-group-item d-flex justify-content-between"
                  v-if="payment.vnpBankCode"
                >
                  <span>Ngân hàng</span>
                  <strong>{{ payment.vnpBankCode }}</strong>
                </li>
                <li
                  class="list-group-item d-flex justify-content-between"
                  v-if="payment.vnpTransactionNo"
                >
                  <span>Mã giao dịch</span>
                  <strong>{{ payment.vnpTransactionNo }}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>Trạng thái</span>
                  <span
                    :class="payment.paymentStatus === 'SUCCESS'
                              ? 'text-success fw-semibold'
                              : 'text-danger fw-semibold'"
                  >
                    {{ payment.paymentStatus }}
                  </span>
                </li>
              </ul>

              <p class="small text-muted mb-0" v-if="payment.paymentStatus !== 'SUCCESS'">
                Nếu số tiền đã bị trừ mà đơn hàng chưa được ghi nhận,
                vui lòng liên hệ hỗ trợ của shop để được kiểm tra.
              </p>
            </template>

            <!-- Không có payment -->
            <template v-else>
              <p class="text-center mb-0">
                Không tìm thấy thông tin thanh toán cho đơn hàng này.
              </p>
            </template>
          </div>

          <div class="card-footer bg-white text-center">
            <button
              class="btn btn-outline-secondary me-2"
              type="button"
              @click="goToOrders"
            >
              Xem đơn hàng của tôi
            </button>

            <!-- Nút Tiếp tục mua sắm -->
            <button
              class="btn btn-success"
              type="button"
              @click="continueShopping"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePaymentStore } from '@/milk-tea/payment/store';

const route = useRoute();
const router = useRouter();
const paymentStore = usePaymentStore();

const loading = ref(true);
const payment = ref(null);

const money = v => new Intl.NumberFormat('vi-VN').format(Number(v) || 0);

const continueShopping = () => {
  // chỉnh lại 'ProductList' hoặc '/store' theo router thực tế 
  router.push({ name: 'products' }); // hoặc: router.push('/store');
};

const goToOrders = () => {
  router.push({ name: 'OrderList' }); // Trang này sẽ được thêm vào sau
};

onMounted(async () => {
  try {
    const orderCode = route.query.orderCode;
    if (!orderCode) {
      console.warn('[PaymentResult] Missing orderCode in query');
      loading.value = false;
      return;
    }
    const res = await paymentStore.fetchPaymentResult(orderCode);
    payment.value = res;
  } catch (e) {
    console.error('[PaymentResult] Error loading payment result', e);
  } finally {
    loading.value = false;
  }
});
</script>
