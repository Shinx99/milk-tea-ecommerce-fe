import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const loaded = ref(false)

  async function loadProducts() {
    if (loaded.value) return
    const res = await axios.get('/admin_data/product_manage.json')
    products.value = res.data
    loaded.value = true
  }

  function add(product) {
    const newProduct = { ...product, id: crypto.randomUUID() }
    products.value.push(newProduct)
  }

  function update(product) {
    const i = products.value.findIndex(p => p.id === product.id)
    if (i !== -1) products.value[i] = { ...product }
  }

  function remove(id) {
    const i = products.value.findIndex(p => p.id === id)
    if (i !== -1) products.value.splice(i, 1)
  }

  function byId(id) {
    return products.value.find(p => p.id === id)
  }

  return { products, loaded, loadProducts, add, update, remove, byId }
})
