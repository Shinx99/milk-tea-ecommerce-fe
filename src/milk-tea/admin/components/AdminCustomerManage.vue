<template>
  <h3 class="mb-4 fw-bolder text-primary">
    <i class="fa-solid fa-layer-group me-2"></i> 
    Quản lý Khách hàng
  </h3>

  <div class="container">
    <!-- Card danh sách + nút thêm khách hàng -->
    <div class="card shadow-sm border-0">
        <div
  class="card-header bg-white d-flex justify-content-between align-items-center"
>
  <!-- Nhóm bên trái: ô search, chiều rộng cố định -->
  <div style="max-width: 350px; width: 100%;">
    <input
      v-model="customerState.keyword"
      type="search"
      class="form-control"
      placeholder="Tìm khách hàng..."
    />
  </div>

  <!-- Nhóm bên phải: badge + nút -->
  <div class="d-flex align-items-center gap-2 ms-3">
    <span class="badge bg-primary-subtle text-primary-emphasis">
      {{ customerState.totalElements }} khách hàng
    </span>

<button
  type="button"
  class="btn btn-primary btn-sm"
  @click="goToRegister"
>
  + Thêm khách hàng
</button>
  </div>
</div>


      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên</th>
                <th scope="col">Email</th>
                <th scope="col">SDT</th>
                <th scope="col">Trạng Thái</th>
                <th scope="col">Ngày Tạo</th>
                <th scope="col">Ngày Cập Nhật</th>
                <th scope="col" class="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="customers.length === 0">
                <td colspan="8" class="text-center text-muted py-4">
                  Khong có khách hàng nào!
                </td>
              </tr>

              <tr v-for="(cus, index) in customers" 
                  :key="cus.id"
                  @dblclick="startEdit(cus), openModal()"
                  class="cursor-pointer">
                <td class="fw-bold">{{ index + 1 }}</td>
                <td>{{ cus.fullname }}</td>
                <td>{{ cus.email }}</td>
                <td>{{ cus.phone }}</td>
                <td>
                  <span
                    class="badge"
                    :class="cus.is_active
                      ? 'badge bg-success'
                      : 'badge bg-danger'"
                  >
                    {{ cus.active ? "Hoạt Động" : "Ẩn" }}
                  </span>
                </td>
                <td class="small text-muted">{{ formatDate(cus.createdAt) }}</td>
                <td class="small text-muted">{{ formatDate(cus.updatedAt) }}</td>
                <td class="text-center">

                  <button
                    class="btn btn-sm btn-outline-secondary me-1"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    @click="startEdit(cus)"
                  >
                    <i class="fa-solid fa-pencil"></i>
                  </button>

                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="removeCustomer(cus.id)"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


              
                  <!-- Pagination -->
    <nav v-if="!customerState.isLoading && customerState.totalPages > 0" aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center align-items-center">
        
        <!-- Nut Prev -->
        <li class="page-item" :class="{ disabled: customerState.page === 0 }">
          <button 
            class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0" 
            @click.prevent="prevPage" 
            :disabled="customerState.page === 0"
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo; Trước</span>
          </button>
        </li>

        <li class="page-item disabled">
          <span class="page-link text-dark fw-bold border-0 bg-transparent">
            Trang {{ customerState.page + 1 }} / {{ customerState.totalPages }}
          </span>
        </li>

        <!-- Nút NEXT -->
        <!-- Disable nếu đang ở trang cuối cùng -->
        <li class="page-item" :class="{ disabled: customerState.page >= customerState.totalPages - 1 }">
          <button 
            class="page-link bg-primary text-white rounded-pill px-3 py-1 border-0" 
            @click.prevent="nextPage"
            :disabled="customerState.page >= customerState.totalPages - 1" 
            aria-label="Next"
          >
            <span aria-hidden="true">Sau &raquo;</span>
          </button>
        </li>

      </ul>
    </nav>
    </div>

    <!-- Modal tạo khách hàng (giữ nguyên, chỉ đặt phía dưới) -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="exampleModalLabel">Cập nhật khách hàng</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Tên</label>
                  <input v-model="newCustomer.fullname" type="text" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Email</label>
                  <input v-model="newCustomer.email" type="email" class="form-control" disabled/>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">SDT</label>
                  <input v-model="newCustomer.phone" type="tel" class="form-control" />
                </div>
                <div class="col-12">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="checkActive"
                      v-model="newCustomer.active"
                    />
                    <label class="form-check-label fw-bold" for="checkActive">
                      Hoạt Động
                    </label>
                  </div>
                </div>
              </div>

              <div class="mt-4 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>

                <button type="submit" class="btn btn-primary px-4 rounded-pill">
                  Cập nhật
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted, computed, watch } from "vue";
import * as bootstrap from "bootstrap";

// Import router
import { useRouter } from 'vue-router';
const router = useRouter();

// Trang them nguoi dung --> dang ky
function goToRegister() {
  router.push('/register'); // dùng path tuyệt đối
}

// Trang changePassword
function goToChangePassword() {
  router.push('/account/change-password'); // dùng path tuyệt đối
}

// import tu composables
import {
  customerState,
  loadCustomer,
  updateCustomer,
  changePage, nextPage, prevPage, deleteCustomer
} from "../composables/UseCustomer.js";

//customer <<--- customerState.list
const customers = computed(() => customerState.list);

// Form tao moi
const newCustomer = ref({
  fullname: "",
  email: "",
  phone: "",
  active: true,
})

// Dang Edit customerId nao? Null ? Create : Update
const edittingId = ref(null);

// Load trang ngay sau khi mo
onMounted(async() => {
  await loadCustomer();
})

// Phuc vu cho realtime search
customerState.searchTimeout = null;

// Watch keyword để search realtime
watch(
  () => customerState.keyword,
  (newVal) => {
    // xoá timer cũ
    if (customerState.searchTimeout) {
      clearTimeout(customerState.searchTimeout);
    }

    // đợi 400ms sau khi ngừng gõ rồi mới gọi API
    customerState.searchTimeout = setTimeout(() => {
      customerState.page = 0;   // luôn quay về trang đầu khi search mới
      loadCustomer();
    }, 100);
  }
);

function startEdit(cus) {
  edittingId.value = cus.id;
  newCustomer.value = {
    fullname: cus.fullname,
    email: cus.email,
    phone: cus.phone,
    active: cus.active,
  }
}

//Method Handle Submit
async function handleSubmit() {
  try {
    const payload = {...newCustomer.value};

    if(edittingId.value){
      await updateCustomer(edittingId.value, payload);
      alert("Cập nhật khách hàng thành công!");
    } else{
      alert("Hệ thống đang bảo trì!");
      //await createCustomerApi(payload);
    }
    await loadCustomer();
    resetForm();
    closeModal(); 
  } catch (error) {
  alert('Lưu khách hàng thất bại: ' + (customerState.error || error.message));
}

}


function openModal() {
  const modalEl = document.getElementById("exampleModal");
  // Lấy instance nếu đã có, hoặc tạo mới nếu chưa
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}


function closeModal() {
  const modalEl = document.getElementById("exampleModal");
  if (!modalEl) return;

  // 1. Đóng modal bằng Bootstrap (nếu có instance)
  const modal =
    bootstrap.Modal.getInstance(modalEl) ||
    bootstrap.Modal.getOrCreateInstance(modalEl);

  modal.hide();

  // 2. Force dọn backdrop + class trên body (chữa cháy)
  document.body.classList.remove("modal-open");
  document.body.style.removeProperty("padding-right");

  const backdrops = document.querySelectorAll(".modal-backdrop");
  backdrops.forEach((el) => el.remove());
}



function resetForm(){
  edittingId.value = null;
  newCustomer.value = {
    fullname: '',
    email: '',
    phone: '',
    active: true,
  }
}

//Delete
async function removeCustomer(id) {
  if(!confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) return;

  try {
    await deleteCustomer(id);
    await loadCustomer();
  } catch (e) {
    alert("Xóa thất bại: " + customerState.error);
  }
}

//Format createdAt va updatedAt theo dd/MM//yyyy
function formatDate(dateString){
  if(!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB");
}


</script>
