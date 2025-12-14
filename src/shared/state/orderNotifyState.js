// src/shared/state/orderNotifyState.js
import { ref } from "vue";

export const newPaidCount = ref(0);
const seen = new Set(); // chống trùng khi reconnect/reload

export function onOrderPaid(dto) {
  const key = dto?.id || dto?.orderCode;
  if (key && seen.has(key)) return;
  if (key) seen.add(key);
  newPaidCount.value += 1;
}

export function resetNewPaidCount() {
  newPaidCount.value = 0;
  seen.clear();
}
