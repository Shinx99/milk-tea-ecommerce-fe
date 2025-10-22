// src/milk-tea/account/store.js
import { defineStore } from 'pinia'
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null,
  }),

  actions: {

    // =========== Login ===============

    async login({ emailOrUsername, password }) {
      try {
        const res = await axios.post(`${API_URL}/login`, {
          email: emailOrUsername,
          password
        });
        if (res.data && res.data.success) {
          this.token = res.data.data.token;
          this.userInfo = res.data.data;
          localStorage.setItem('token', this.token);  //save token vào localStorage 
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
          return this.userInfo;
        } else {
          throw new Error(res.data?.message || "Đăng nhập thất bại");
        }
      } catch (err) {
        throw new Error(
          err.response?.data?.message ||
          err.message ||
          "Đăng nhập thất bại"
        );
      }
    },

    // =========== Logout ===============

    logout() {
      this.token = '';
      this.userInfo = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    },

    // =========== Restore =============== Được sử dụng trong main.js

    restore() {
      this.token = localStorage.getItem('token') || '';
      const info = localStorage.getItem('userInfo');
      this.userInfo = info ? JSON.parse(info) : null;
    },

    // =========== Register  ===============

    async register(data) {
      const res = await axios.post(`${API_URL}/register`, data);
      if (res.data && res.data.success) {
        return res.data.data;
      } else {
        throw new Error(res.data?.message || "Đăng ký thất bại");
      }
    },

    // =========== Forgot PW ===============

    async forgotPassword(email) {
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      if (res.data && res.data.success) {
        return res.data;
      } else {
        throw new Error(res.data?.message || "Quên mật khẩu thất bại");
      }
    },

    // =========== Update Profile ===============

    // async updateProfile(payload) {
    //   const res = await axios.put(
    //     `${API_URL}/profile`, payload,
    //     { headers: { Authorization: `Bearer ${this.token}` } }
    //   );
    //   if (res.data && res.data.success) {
    //     this.userInfo = res.data.data;
    //     localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
    //     return this.userInfo;
    //   } else {
    //     throw new Error(res.data?.message || "Cập nhật thất bại");
    //   }
    // },


    // =========== Reset Password ===============

    async resetPassword({ token, newPassword, confirmPassword }) {
      try {
        const res = await axios.post(`${API_URL}/reset-password`, {
          token,
          newPassword,
          confirmPassword
        });
        if (res.data && res.data.success) {
          return res.data;
        } else {
          throw new Error(res.data?.message || "Đặt lại mật khẩu thất bại");
        }
      } catch (err) {
        throw new Error(
          err.response?.data?.message ||
          err.message ||
          "Đặt lại mật khẩu thất bại"
        );
      }
    },

    // =========== Change Password ===============

    async changePassword(payload){

      // 1. Check xem user đã login chưa

      if(!this.userInfo || !this.token || !this.userInfo.userId){
        throw new Error("Bạn chưa đăng nhập hoặc phiên bản đã hết hạn");
      }
      //const userId = this.userInfo.id

      // 2. gọi API PUT với Authorization header
      try{

        const res = await axios.put(`${API_URL}/change-password`,
          payload,{
            headers:{
              Authorization: `Bearer ${this.token}`
            }
          }
        );

      // 3. Xử lý kết quả
        if(res.data && res.data.success){
          return res.data;
        }else{
          throw new Error(res.data?.message || "Đổi mật khẩu thất bại");
        }

      }catch(err){

      // 4. Bắt lỗi 
        throw new Error(
          err.response?.data?.message ||
          err.message ||
          "Đổi mật khẩu thất bại"
        );

      }
    }
  }
});
