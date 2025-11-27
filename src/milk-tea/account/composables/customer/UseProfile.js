// src/composables/useProfile.js

import { ref } from 'vue';
import { getProfile as getProfileApi, updateProfile as updateProfileApi } from '@/milk-tea/account/service/Profile';
import { useUserStore } from '@/milk-tea/account/store';

export function useProfile() {
  const profile = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const userStore = useUserStore();

  // --- Hàm loadProfile ---
  const loadProfile = async () => {
    if (!userStore.token) {
      error.value = 'Bạn chưa đăng nhập';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const res = await getProfileApi();
      profile.value = res.data;
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  // --- Hàm updateProfile ---
  const updateProfile = async (payload) => {
    if (!userStore.token) {
      error.value = 'Bạn chưa đăng nhập';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const updatedProfile = await updateProfileApi(payload);
      profile.value = updatedProfile; 
      
      // Tùy chọn: Update ngược lại vào store để đồng bộ dữ liệu toàn app
      // userStore.userInfo = updatedProfile;
      
    } catch (e) {
      error.value = e.message;
      throw e; 
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
