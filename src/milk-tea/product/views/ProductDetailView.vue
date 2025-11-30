<script setup>
import { computed, reactive, watch, ref, onMounted } from 'vue' 
import { useRoute, useRouter } from 'vue-router'
import { useProductDetail } from '../composables/ProductDetailView.js'
import ProductCard from '../components/ProductCard.vue'
import { loadProducts, productState } from '../composables/ProductsBase.js'

import { addToCartServer } from '@/milk-tea/cart/store'
import { useUserStore } from '@/milk-tea/account/store'
const userStore = useUserStore()

// Check Login
const isLoggedIn = computed(() => {
    return !!userStore.userInfo?.userId && !!localStorage.getItem('token')
})

const route = useRoute()
const router = useRouter()

// 1. Lấy ID từ URL
const currentId = ref(route.params.id);

// 2. Gọi Composable
// LƯU Ý: Phải truyền 'currentId.value', không phải 'id' (vì biến id chưa khai báo)
const {
  product, qty, unitPrice, total, dec, inc,
  detailLoading, detailError, loadDetail,
  relatedProducts, relatedLoading, relatedError, loadRelated
} = useProductDetail(currentId.value)


// 3. Watcher duy nhất để xử lý load dữ liệu (Gộp cả 2 cái watch của bạn lại làm 1)
watch(
    () => route.params.id, 
    async (newId) => {
        if (newId) {
            currentId.value = newId;
            console.log("URL đổi ID mới:", newId);
            await loadDetail(newId);
            await loadRelated(newId) 
            
            // Nếu load xong mà lỗi hoặc không có sản phẩm -> Về trang danh sách
            if (!product.value && !detailLoading.value && !detailError.value) {
                router.replace('/products')
            }
        }
    },
    { immediate: true } // Chạy ngay lập tức khi vào trang
);

// 4. Logic options: lưu THEO ID
// key: parentCategoryId, value: childCategoryId được chọn
const selectedOptions = reactive({})

const isSelected = (group, option) =>
  selectedOptions[group.id] === option.id

const selectOption = (group, option) => {
  selectedOptions[group.id] = option.id
}

// reset & auto chọn option đầu tiên
watch(() => product.value, (newVal) => {
  Object.keys(selectedOptions).forEach(k => delete selectedOptions[k])

  if (newVal?.category?.children) {
    newVal.category.children.forEach(group => {
      if (group.children?.length) {
        selectedOptions[group.id] = group.children[0].id
      }
    })
  }
})

// 5. Map selectedOptions -> DTO field
function buildOptionIds() {
  const optIds = {
    sizeCategoryId: null,
    sugarCategoryId: null,
    iceCategoryId: null,
    temperatureCategoryId: null,
  }

  if (!product.value?.category?.children) return optIds

  product.value.category.children.forEach(group => {
    const childId = selectedOptions[group.id]
    if (!childId) return

    const name = group.categoryName?.toLowerCase() || ''

    switch (name) {
      case 'size':
        optIds.sizeCategoryId = childId
        break
      case 'đường':
      case 'sugar':
        optIds.sugarCategoryId = childId
        break
      case 'đá':
      case 'ice':
        optIds.iceCategoryId = childId
        break
      case 'nhiệt độ':
      case 'temperature':
        optIds.temperatureCategoryId = childId
        break
    }
  })

  return optIds
}

// 6. Add to cart
const handleAddToCart = async () => {
  if (!product.value) return

  const optIds = buildOptionIds()

  if (isLoggedIn.value) {
    // ĐÃ LOGIN: gửi lên server
    const payload = {
      productId: product.value.id,
      quantity: qty.value,
      ...optIds,
    }

    try {
      await addToCartServer(payload)
      console.log('Add to cart (server):', payload)
    } catch (e) {
      console.error('Add to cart server error', e)
    }
  } else {
    // GUEST: lưu localStorage
    // build note text từ category + tên option
    const noteParts = []
    if (product.value?.category?.children) {
      product.value.category.children.forEach(group => {
        const childId = selectedOptions[group.id]
        const child = group.children?.find(c => c.id === childId)
        if (child) {
          noteParts.push(`${group.categoryName}: ${child.categoryName}`)
        }
      })
    }
    const noteString = noteParts.join(', ')

    const cartItem = {
      id: product.value.id,
      name: product.value.name,
      image: mainImageUrl.value || null,
      price: product.value.price,
      qty: qty.value,
      note: noteString,
      options: {
        ...selectedOptions, // parentId -> childId (dùng để sync server sau này)
      },
    }

    const existingCart = JSON.parse(localStorage.getItem('mt_cart_guest') || '[]')
    existingCart.push(cartItem)
    localStorage.setItem('mt_cart_guest', JSON.stringify(existingCart))

    console.log('Add to cart (guest):', cartItem)
  }
}

const mainImageUrl = computed(() =>
  product.value?.imageUrl?.length ? product.value.imageUrl[0] : null
)
</script>

<template>
    <!-- Template giữ nguyên như cũ -->
    <section v-if="detailLoading" class="container py-5 text-center text-muted">
        <div class="spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div>
        Đang tải sản phẩm...
    </section>
    <section v-else-if="detailError" class="container py-5 text-center text-danger">
        Lỗi: {{ detailError }}
    </section>

    <section class="container" v-else-if="product" :key="route.params.id">
        <div class="row g-4 align-items-start justify-content-center">
            <div class="col-12 col-lg-4 text-center">
                <img v-if="mainImageUrl" :src="mainImageUrl" :alt="product.name" class="img-fluid rounded shadow-sm"
                    style="max-height: 600px; object-fit: contain;" />
                <div v-else
                    class="img-fluid rounded shadow-sm d-flex align-items-center justify-content-center text-muted border"
                    style="height: 400px; background-color: #f8f9fa;">
                    [Ảnh không có]
                </div>
            </div>

            <div class="col-12 col-lg-4 px-lg-3">
                <div class="card shadow-sm border-warning-subtle">
                    <div class="card-body p-3 p-md-4">
                        <h4 class="fw-bold mb-1">{{ product.name }}</h4>
                        <h3 class="text-warning fw-bold mt-2 mb-3">{{ total.toLocaleString() }} VND</h3>

                        <div v-if="product.category && product.category.children && product.category.children.length > 0">
                            <h5 class="text-muted small mb-2 mt-4">Tùy chọn:</h5>
                            <div v-for="group in product.category.children" :key="group.id" class="mb-3">
                                <label class="fw-semibold mb-1">{{ group.categoryName }}</label>
                                <div class="btn-group w-100 btn-group-sm flex-wrap">
                                    <button
                                        v-for="option in group.children"
                                        :key="option.id"
                                        class="btn"
                                        :class="isSelected(group, option) ? 'btn-warning' : 'btn-outline-warning'"
                                        @click="selectOption(group, option)"
                                    >
                                        {{ option.categoryName }}
                                    </button>

                                </div>
                            </div>
                        </div>

                        <div class="d-flex align-items-center gap-2 mb-3">
                            <button class="btn btn-outline-warning btn-sm" @click="dec">-</button>
                            <span class="px-2">{{ qty }}</span>
                            <button class="btn btn-outline-warning btn-sm" @click="inc">+</button>
                        </div>

                        <button
                            class="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2 btn-sm py-2"
                            @click="handleAddToCart">
                            <i class="bi bi-cart"></i>
                            Thêm vào giỏ hàng : {{ total.toLocaleString() }} đ
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="">
            <div class="d-flex align-items-center ">
                <h3 class="mb-0">Sản phẩm cùng loại</h3>
            </div>

            <div v-if="relatedProducts.length" class="row ">
                <div class="col-12 col-sm-6 col-lg-3" v-for="rp in relatedProducts" :key="rp.id">
                    <ProductCard :product="rp" />
                </div>
            </div>
            <div v-else class="text-muted small">Chưa có sản phẩm cùng loại.</div>
        </div>

    </section>

    <section v-else class="container py-5 text-center text-muted">
        Không tìm thấy sản phẩm này.
    </section>
</template>
