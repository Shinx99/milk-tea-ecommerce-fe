<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productState } from '../composables/ProductsBase.js'
import { useProductDetail } from '../composables/ProductDetailView.js'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()

const id = route.params.id

const {
    product, qty, unitPrice, total, dec, inc, addToCartNow,
    detailLoading, detailError, loadDetail
} = useProductDetail(id)


// 1. Biến lưu trạng thái chọn (Reactive Object)
// Ví dụ: { "Size": "L", "Đá": "Ít" }
const selectedOptions = reactive({})

// 2. Hàm kiểm tra trạng thái Active (Dùng để tô màu nút bấm)
const isSelected = (groupName, optionName) => {
    return selectedOptions[groupName] === optionName
}

// 3. Hàm cập nhật khi bấm nút (Setter)
const selectOption = (groupName, optionName) => {
    selectedOptions[groupName] = optionName
}

// 4. Tự động chọn mặc định khi load xong sản phẩm
// (Để tránh trường hợp khách quên chọn Size)
watch(() => product.value, (newVal) => {
    // Reset lại lựa chọn cũ khi đổi sản phẩm
    Object.keys(selectedOptions).forEach(key => delete selectedOptions[key])

    if (newVal && newVal.category && newVal.category.children) {
        newVal.category.children.forEach(group => {
            // Nếu nhóm này có các lựa chọn con (S, M, L...)
            if (group.children && group.children.length > 0) {
                // Mặc định chọn thằng đầu tiên trong danh sách
                selectedOptions[group.categoryName] = group.children[0].categoryName
            }
        })
    }
})

// 5. Hàm Add To Cart (Sửa lại để gom options)
// Bạn cần import hàm addToCart gốc từ store hoặc viết đè ở đây
// const handleAddToCart = () => {
//     // Gom các lựa chọn thành chuỗi text
//     // Ví dụ: "Size: L, Đá: Ít"
//     const noteString = Object.entries(selectedOptions)
//         .map(([key, value]) => `${key}: ${value}`)
//         .join(', ')

//     console.log("Đang thêm vào giỏ:", {
//         productId: product.value.id,
//         qty: qty.value,
//         totalPrice: total.value,
//         note: noteString // <--- ĐÂY LÀ CÁI BẠN CẦN LƯU XUỐNG DB
//     })

//     // Gọi hàm logic gốc (nếu cần)
//     // addToCartNow(product.value, qty.value, noteString)
// }


watch(
    () => route.params.id,
    async (newId) => {
        if (newId) {
            await loadDetail(newId)

            if (!product.value && !detailLoading.value && !detailError.value) {
                router.replace('/products')
            }
        }
    },
    { immediate: true }
);

const relatedProducts = computed(() => {
    const p = product.value
    if (!p) return []
    return productState.list
        .filter(x => x.categoryId === p.categoryId && x.id !== p.id)
        .slice(0, 4)
})

// === HÀM LẤY ẢNH CHÍNH TỪ DỮ LIỆU ===
const mainImageUrl = computed(() => {
    return (product.value && product.value.imageUrl && product.value.imageUrl.length > 0)
        ? product.value.imageUrl[0]
        : null;
});
</script>

<template>
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
                        <!-- <h5 class="text-muted small mb-3">{{ product.description }}</h5> -->

                        <!-- Chỉ hiện nếu sản phẩm có options con (Size, Đá...) -->
                        <div v-if="product.category && product.category.children && product.category.children.length > 0">
                            <h5 class="text-muted small mb-2 mt-4">Tùy chọn:</h5>

                            <!-- VÒNG LẶP 1: Duyệt qua từng nhóm (Size, Đá, Đường...) -->
                            <div v-for="group in product.category.children" :key="group.id" class="mb-3">
        
                                <!-- Tên nhóm: Size, Mức đá -->
                                <label class="fw-semibold mb-1">{{ group.categoryName }}</label>

                                <!-- VÒNG LẶP 2: Duyệt qua các giá trị con (S, M, L...) -->
                                <div class="btn-group w-100 btn-group-sm flex-wrap">
                                    <button 
                                    v-for="option in group.children" 
                                    :key="option.id"
                                    class="btn"
                                    :class="isSelected(group.categoryName, option.categoryName) ? 'btn-warning' : 'btn-outline-warning'"
                                    @click="selectOption(group.categoryName, option.categoryName)"
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
