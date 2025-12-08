import { defineStore } from 'pinia';
import axios from 'axios';

const http = axios.create({ baseURL: 'http://localhost:8080/api' });

http.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    loading: false,
    error: null,
    lastPayment: null,
  }),
  actions: {
    async createVnpayPayment(orderId) {
      this.loading = true;
      this.error = null;
      try {
        const res = await http.post('/payments/vnpay/create', { orderId });
        if (!res.data?.success) {
          throw new Error(res.data?.message || 'Tạo thanh toán VNPay thất bại');
        }
        this.lastPayment = res.data.data;
        return this.lastPayment; // có paymentUrl
      } catch (e) {
        console.error(e);
        this.error = 'Tạo thanh toán thất bại';
        throw e;
      } finally {
        this.loading = false;
      }
    },

    // async fetchPaymentResult(orderId) {
    //   try {
    //     const res = await http.get(`/payments/${orderId}/result`);
    //     return res.data.data; // PaymentResultDto
    //   } catch (e) {
    //     console.error(e);
    //     throw e;
    //   }
    // }

        
    async fetchPaymentResult(orderCode) {
      try {
        const res = await http.get(`/payments/by-code/${orderCode}/result`);
        return res.data.data; // PaymentResultDto
      } catch (e) {
        console.error(e);
        throw e;
      }
    }

  }
});
