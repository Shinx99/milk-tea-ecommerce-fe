// src/milk-tea/order/store.js
import { defineStore } from 'pinia';
import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:8080/api'
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useOrderStore = defineStore('order', {
  state: () => ({
    lastOrder: null,
    loading: false,
    error: null
  }),
  actions: {
    async checkout(payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await http.post('/orders/checkout', payload);
          if (!res.data?.success) {
            throw new Error(res.data?.message || 'Đặt hàng thất bại');
          }
        this.lastOrder = res.data.data;
        return this.lastOrder;
      } catch (e) {
        console.error(e);
        this.error = 'Đặt hàng thất bại';
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async fetchOrder(orderId) {
      this.loading = true;
      this.error = null;
      try {
        const res = await http.get(`/orders/${orderId}`);
        this.lastOrder = res.data.data;
        return this.lastOrder;
      } catch (e) {
        console.error(e);
        this.error = 'Không tải được đơn hàng';
        throw e;
      } finally {
        this.loading = false;
      }
    }
  }
});
