// src/composables/useProfile.js

import { ref } from 'vue';
import { getProfile as getProfileApi, updateProfile as updateProfileApi } from '@/milk-tea/account/service/Profile';

export function useProfile() {
  const profile = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Hàm để tải dữ liệu profile từ API
  const loadProfile = async (id) => {
    if (!id) return;
    loading.value = true;
    error.value = null;
    try {
      profile.value = await getProfileApi(id);
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  // Hàm để cập nhật profile
  const updateProfile = async (id, payload) => {
    if (!id) throw new Error("ID người dùng là bắt buộc.");
    loading.value = true;
    error.value = null;
    try {
      // Giả sử API trả về profile đã cập nhật
      const updatedProfile = await updateProfileApi(id, payload);
      profile.value = updatedProfile; // Cập nhật state cục bộ
    } catch (e) {
      error.value = e.message;
      throw e; // Ném lỗi ra để component biết và xử lý
    } finally {
      loading.value = false;
    }
  };

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
  };
}
