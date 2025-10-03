<script setup>
import { updateQty, removeFromCart } from '../store'

defineProps({ item: Object })
</script>

<template>
  <tr>
    <td style="width:80px"><img :src="item.image" class="img-fluid rounded" /></td>
    <td>
      <div class="fw-semibold">{{ item.name }}</div>
      <div class="small text-muted">
        Size: <b>{{ item.options?.size }}</b> 
        • Ngọt: <b>{{ item.options?.sugar }}</b> 
         • Đá: <b>{{ item.options?.ice }}</b>
        <span v-if="item.options?.extraIce">• Đá riêng</span>
      </div>
    </td>
    <td>{{ item.price.toLocaleString() }} đ</td>
    <td>
      <div class="input-group input-group-sm" style="max-width:140px">
        <button class="btn btn-outline-secondary" @click="updateQty(item.key, item.qty-1)">-</button>
        <input class="form-control text-center" type="number" :value="item.qty" @change="updateQty(item.key, +$event.target.value)" />
        <button class="btn btn-outline-secondary" @click="updateQty(item.key, item.qty+1)">+</button>
      </div>
    </td>
    <td>{{ (item.price * item.qty).toLocaleString() }} đ</td>
    <td>
      <button class="btn btn-sm btn-danger" @click="removeFromCart(item.key)"><i class="bi bi-trash"></i></button>
    </td>
  </tr>
</template>
