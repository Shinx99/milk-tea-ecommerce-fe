// src/milk-tea/account/composables/useAddress.js

import { ref } from "vue";
import {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/milk-tea/account/service/Address";

export function useAddress() {
  const addresses = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Load all addresses of current user
  const loadAddresses = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await getMyAddresses();
      addresses.value = res.data || [];
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const create = async (payload) => {
    const res = await createAddress(payload);
    addresses.value.push(res.data);
    await loadAddresses();
    return res.data;
  };

  const update = async (id, payload) => {
    const res = await updateAddress(id, payload);
    const idx = addresses.value.findIndex((a) => a.id === id);
    if (idx !== -1) addresses.value[idx] = res.data;
    await loadAddresses();
    return res.data;
  };

  const remove = async (id) => {
    await deleteAddress(id);
    const idx = addresses.value.findIndex((a) => a.id === id);
    if (idx !== -1) addresses.value[idx].active = false;
    await loadAddresses();
  };

  return {
    addresses,
    loading,
    error,
    loadAddresses,
    create,
    update,
    remove,
  };
}
