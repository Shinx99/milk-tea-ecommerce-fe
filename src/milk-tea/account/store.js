// src/milk-tea/account/store.js
import { defineStore } from 'pinia'
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/auth";

// validate password
const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push("Mật khẩu không được để trống");
  } else {
    if (password.length < 6) {
      errors.push("Mật khẩu phải có ít nhất 6 ký tự");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Mật khẩu phải có ít nhất 1 chữ hoa (A-Z)");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Mật khẩu phải có ít nhất 1 chữ thường (a-z)");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Mật khẩu phải có ít nhất 1 chữ số (0-9)");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&* etc)");
    }
  }
  
  return errors;
};


export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null,
  }),

  actions: {

    // =========== Login ===============

    async login({ emailOrUsername, password }) {
      // 🔥 Validation trước khi gọi API
      if (!emailOrUsername || !emailOrUsername.trim()) {
        throw new Error("Vui lòng nhập email hoặc tên đăng nhập");
      }
      
      if (!password) {
        throw new Error("Vui lòng nhập mật khẩu");
      }
      
      if (password.length < 6) {
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
      }
      
      try {
        const res = await axios.post(`${API_URL}/login`, {
          email: emailOrUsername,
          password: password
        });
        
        if (res.data && res.data.success) {
          this.token = res.data.data.token;
          this.userInfo = res.data.data;
          localStorage.setItem('token', this.token);
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
          return this.userInfo;
        } else {
          throw new Error(res.data?.message || "Đăng nhập thất bại");
        }
      } catch (err) {
        // Xử lý lỗi từ backend
        let errorMessage = "";
        
        if (err.response) {
          const status = err.response.status;
          const backendMessage = err.response.data?.message;
          
          if (status === 401) {
            errorMessage = "Email hoặc mật khẩu không đúng. Vui lòng thử lại.";
          } else if (status === 403) {
            errorMessage = "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.";
          } else if (status === 400) {
            errorMessage = backendMessage || "Thông tin đăng nhập không hợp lệ";
          } else if (status >= 500) {
            errorMessage = "Lỗi hệ thống, vui lòng thử lại sau";
          } else {
            errorMessage = backendMessage || "Đăng nhập thất bại";
          }
        } else if (err.request) {
          errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra mạng.";
        } else {
          errorMessage = err.message || "Đăng nhập thất bại";
        }
        
        throw new Error(errorMessage);
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
      // Validation password trước khi gọi API
      const passwordErrors = validatePassword(data.password);
      if (passwordErrors.length > 0) {
        throw new Error(passwordErrors.join(". "));
      }
      
      try {
        const res = await axios.post(`${API_URL}/register`, data);
        
        if (res.data && res.data.success) {
          return res.data.data;
        } else {
          throw new Error(res.data?.message || "Đăng ký thất bại");
        }
      } catch (err) {
        console.error("Register error:", err);
        
        if (err.response) {
          const status = err.response.status;
          const backendMessage = err.response.data?.message;
          const backendData = err.response.data?.data;
          
          if (status === 400 && backendData && typeof backendData === 'object') {
            const firstErrorKey = Object.keys(backendData)[0];
            const firstErrorMessage = backendData[firstErrorKey];
            throw new Error(firstErrorMessage || backendMessage || "Dữ liệu không hợp lệ");
          }
          
          if (status === 400) {
            throw new Error(backendMessage || "Thông tin đăng ký không hợp lệ");
          }
          
          if (status >= 500) {
            throw new Error("Lỗi hệ thống, vui lòng thử lại sau");
          }
          
          throw new Error(backendMessage || `Lỗi ${status}: Đăng ký thất bại`);
        } 
        else if (err.request) {
          throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra mạng.");
        } 
        else {
          throw new Error(err.message || "Đăng ký thất bại");
        }
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
