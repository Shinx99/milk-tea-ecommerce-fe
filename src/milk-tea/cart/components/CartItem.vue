<!-- src/milk-tea/cart/components/CartItem.vue -->
<script setup>
import {
  updateQtyGuest,
  removeFromCartGuest,
  updateCartItemServer,
  removeCartItemsServer,
} from '../store'

const props = defineProps({
  item: { type: Object, required: true },
  loggedIn: { type: Boolean, default: false },
})

const emit = defineEmits(['updated'])

function changeQty(deltaOrValue) {
  if (props.loggedIn) {
    // server: item có id, quantity, sizeCategoryId...
    const newQty =
      typeof deltaOrValue === 'number'
        ? deltaOrValue
        : Number(deltaOrValue.target.value || 0)

    if (newQty <= 0) {
      removeServer()
      return
    }

    updateCartItemServer(props.item.id, { quantity: newQty }).then(() =>
      emit('updated')
    )
  } else {
    // guest: key + qty
    const newQty =
      typeof deltaOrValue === 'number'
        ? deltaOrValue
        : Number(deltaOrValue.target.value || 0)
    updateQtyGuest(props.item.key, newQty)
  }
}

function removeServer() {
  removeCartItemsServer([props.item.id]).then(() => emit('updated'))
}

function removeLocal() {
  removeFromCartGuest(props.item.key)
}
</script>

<template>
  <tr>
    <td style="width:80px">
      <img :src="item.productImage || item.image" class="img-fluid rounded" />
    </td>
    <td>
      <div class="fw-semibold">
        {{ item.productName || item.name }}
      </div>
      <div class="small text-muted">
        Size:
        <b>{{ item.sizeName || item.options?.size }}</b>
        • Đường:
        <b>{{ item.sugarName || item.options?.sugar }}</b>
        • Đá:
        <b>{{ item.iceName || item.options?.ice }}</b>
        <span v-if="item.temperatureName">
          • Nhiệt độ: <b>{{ item.temperatureName }}</b>
        </span>
        <span v-if="item.options?.extraIce">• Đá riêng</span>
      </div>
    </td>
    <td>
      {{ (item.unitPrice || item.price).toLocaleString() }} đ
    </td>
    <td>
      <div class="input-group input-group-sm" style="max-width:140px">
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="changeQty((item.quantity ?? item.qty) - 1)"
        >
          -
        </button>
        <input
          class="form-control text-center"
          type="number"
          :value="item.quantity ?? item.qty"
          @change="changeQty($event)"
        />
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="changeQty((item.quantity ?? item.qty) + 1)"
        >
          +
        </button>
      </div>
    </td>
    <td>
      {{
        (
          (item.unitPrice || item.price) *
          (item.quantity ?? item.qty)
        ).toLocaleString()
      }}
      đ
    </td>
    <td>
      <button
        type="button"
        class="btn btn-sm btn-danger"
        @click="loggedIn ? removeServer() : removeLocal()"
      >
        <i class="bi bi-trash"></i>
      </button>
    </td>
  </tr>
</template>
