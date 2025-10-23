import { ref } from "vue";
import {
  getProfile as getProfileApi,
  updateProfile as updateProfileApi,
} from "@/milk-tea/account/service/Profile";

export function useProfile() {
  const profile = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Load profile theo userId
  const loadProfile = async (userId) => {
    if (!userId) return;
    loading.value = true;
    error.value = null;
    try {
      profile.value = await getProfileApi(userId);
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  // Cập nhật profile theo userId & payload (payload chứa fullname, phone, addresses)
  const updateProfile = async (userId, payload) => {
    if (!userId) throw new Error("ID người dùng là bắt buộc.");
    loading.value = true;
    error.value = null;
    try {
      const updatedProfile = await updateProfileApi(userId, payload);
      profile.value = updatedProfile;
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
