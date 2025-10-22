<script setup>
import axios from '@/api/apiClient'
import { ref } from 'vue'

// Nhận props từ component cha
defineProps({ item: Object })

// Emit sự kiện để thông báo cho cha reload giỏ hàng
const emit = defineEmits(['updated', 'removed'])

const isUpdating = ref(false)

/**
 * Hàm cập nhật số lượng sản phẩm
 */
async function safeUpdateQty(newQty) {
  if (newQty < 1 || isUpdating.value) return
  isUpdating.value = true
  try {
    await axios.put(`/api/cart/update/${item.id}`, { quantity: newQty })
    emit('updated') // Thông báo cho cha reload giỏ hàng
  } catch (error) {
    console.error('Lỗi khi cập nhật số lượng:', error)
  } finally {
    isUpdating.value = false
  }
}

/**
 * Hàm xóa sản phẩm khỏi giỏ hàng
 */
async function handleRemove() {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
    try {
      await axios.delete(`/api/cart/remove/${item.id}`)
      emit('removed') // Thông báo cho cha reload giỏ hàng
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error)
    }
  }
}
</script>

<template>
  <tr>
    <td style="width:80px">
      <img :src="item.image" :alt="item.name" class="img-fluid rounded" />
    </td>
    <td>
      <div class="fw-semibold">{{ item.name }}</div>
      <div class="small text-muted">
        Size: <b>{{ item.options?.size }}</b> • Ngọt: <b>{{ item.options?.sugar }}</b> • Đá: <b>{{ item.options?.ice }}</b>
        <span v-if="item.options?.extraIce">• Đá riêng</span>
      </div>
    </td>
    <td>{{ item.price.toLocaleString() }} đ</td>
    <td>
      <div class="input-group input-group-sm" style="max-width:140px">
        <button class="btn btn-outline-secondary" @click="safeUpdateQty(item.qty - 1)">-</button>
        <input
          class="form-control text-center"
          type="number"
          :value="item.qty"
          @change="safeUpdateQty(+$event.target.value)"
        />
        <button class="btn btn-outline-secondary" @click="safeUpdateQty(item.qty + 1)">+</button>
      </div>
    </td>
    <td>{{ (item.price * item.qty).toLocaleString() }} đ</td>
    <td>
      <button class="btn btn-sm btn-danger" @click="handleRemove">
        <i class="bi bi-trash"></i>
      </button>
    </td>
  </tr>
</template>