<template>
  <div class="container my-4">
    <div class="row">
      <!-- Cột trái: Thông tin thanh toán -->
      <div class="col-lg-7 mb-4">
        <h4 class="mb-3">Thông tin thanh toán</h4>

        <form @submit.prevent="onSubmit">
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Tên *</label>
              <input
                v-model="form.customerName"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Số điện thoại *</label>
              <input
                v-model="form.phone"
                type="text"
                class="form-control"
                required
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Địa chỉ *</label>
            <input
              v-model="form.address"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="mt-3">
            <label class="form-label d-block">Phương thức thanh toán *</label>
            <div class="form-check">
              <input class="form-check-input"
                    type="radio"
                    id="pm-cod"
                    value="COD"
                    v-model="form.paymentMethod" />
              <label class="form-check-label" for="pm-cod">Thanh toán khi nhận hàng (COD)</label>
            </div>
            <div class="form-check">
              <input class="form-check-input"
                    type="radio"
                    id="pm-vnpay"
                    value="VNPAY"
                    v-model="form.paymentMethod" />
              <label class="form-check-label" for="pm-vnpay">Thanh toán online qua VNPay</label>
            </div>
          </div>


          <div class="mb-3">
            <label class="form-label">Ghi chú đơn hàng (tùy chọn)</label>
            <textarea
              v-model="form.note"
              rows="3"
              class="form-control"
            ></textarea>
          </div>
          
        </form>
      </div>

      <!-- Cột phải: Đơn hàng của bạn -->
      <div class="col-lg-5">
        <h4 class="mb-3">Đơn hàng của bạn</h4>

        <div class="border p-3 bg-light">
          <div class="d-flex justify-content-between fw-semibold border-bottom pb-2 mb-2">
            <span>Sản phẩm</span>
            <span>Tạm tính</span>
          </div>

          <div
            v-for="item in cartItems"
            :key="item.id"
            class="d-flex justify-content-between mb-2"
          >
            <div>
              <div>{{ item.productName }}</div>
              <div class="text-muted small">x{{ item.quantity }}</div>
            </div>
            <div>{{ money(item.totalPrice) }}</div>
          </div>

          <hr />

          <div class="d-flex justify-content-between mb-1">
            <span>Tạm tính</span>
            <span>{{ money(subtotal) }}</span>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span>Phí vận chuyển</span>
            <span>{{ money(shippingFee) }}</span>
          </div>
          <div class="d-flex justify-content-between fw-bold mt-2">
            <span>Tổng</span>
            <span>{{ money(total) }} đ</span>
          </div>

          <button
            class="btn btn-dark w-100 mt-3"
            :disabled="loading"
            @click="onSubmit"
          >
            {{ loading ? 'Đang đặt hàng...' : 'ĐẶT HÀNG' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useOrderStore } from '@/milk-tea/order/store';  // store order
import { cartState } from '@/milk-tea/cart/store';       // state cart
import { usePaymentStore } from '@/milk-tea/payment/store'; // store payment

export default {
  name: 'CheckoutOrderView',
  setup() {
    const orderStore = useOrderStore();
    const router = useRouter();
    const paymentStore = usePaymentStore();
    const loading = ref(false);

    const cartItems = computed(() => cartState.activeItems || []);
    const subtotal = computed(() =>
      cartState.summary?.subTotal ?? cartState.summary?.subtotal ?? 0
    );
    const shippingFee = computed(() =>
      cartState.summary?.shippingFee ?? 0
    );
    const total = computed(() =>
      cartState.summary?.total ?? 0
    );

    const form = ref({   //form State
      customerName: '',
      phone: '',
      address: '',
      note: '',
      paymentMethod: 'COD'
    });

    const money = v =>
      new Intl.NumberFormat('vi-VN').format(v || 0);

    const onSubmit = async () => {
      if (loading.value) return;
      loading.value = true;
      try {
        const payload = { ...form.value };
        const order = await orderStore.checkout(payload); // backend trả về order.id hoặc orderCode

        if(form.value.paymentMethod === 'VNPAY') {
          // Chuyển hướng sang trang thanh toán VNPay
          const payment = await paymentStore.createVnpayPayment(order.id);
          window.location.href = payment.paymentUrl;

          // if(payment?.paymentUrl) {
          //   window.location.href = payment.paymentUrl;
          // } else {
          //   alert('Không thể tạo link thanh toán VNPay');
          //   return;
          // }

        }else{
          // Thanh toán COD
        router.push({ name: 'OrderDetail', params: { id: order.id } });
        }
        
      } catch (e) {
        console.error(e);
        alert('Đặt hàng thất bại, thử lại sau nhé!');
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      cartItems,
      subtotal,
      shippingFee,
      total,
      money,
      onSubmit
    };
  }
};
</script>
