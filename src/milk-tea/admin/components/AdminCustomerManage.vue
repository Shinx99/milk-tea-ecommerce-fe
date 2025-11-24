<template>
  <h3 class="mb-4 fw-bold">Quản lý Khách hàng</h3>
  <div class="container">
    <div class="row">
      <!-- Form -->
      <div class="col-sm-3">
        <div>
          <div class="mb-3">
            <div class="mb-3">
              <label class="form-label fw-bold">Full name:</label>
              <input v-model="newCustomer.fullname" type="text" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Email:</label>
              <input v-model="newCustomer.email" type="email" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Phone:</label>
              <input v-model="newCustomer.phone" type="tel" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Password:</label>
              <input v-model="newCustomer.password" type="password" class="form-control" />
            </div>

            <div class="mb-3">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="checkActive" v-model="newCustomer.is_active" />
                <label class="form-check-label fw-bold" for="checkActive">
                  Active
                </label>
              </div>
            </div>

            <div class="d-flex justify-content-center">
              <button type="button" class="btn btn-light btn-lg rounded-pill w-20 border border-5"
                @click="createCustomer">
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="col-sm-9">
        <table class="table table-light table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Full name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Active</th>
              <th scope="col">Created at</th>
              <th scope="col">Updated at</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cus, index) in customers" :key="cus.id">
              <td class="fw-bold">{{ index + 1 }}</td>
              <td>{{ cus.fullname }}</td>
              <td>{{ cus.email }}</td>
              <td>{{ cus.phone }}</td>
              <td>{{ cus.is_active ? "Yes" : "No" }}</td>
              <td>{{ cus.created_at }}</td>
              <td>{{ cus.updated_at }}</td>
              <td>
                <button class="btn me-3" @click="startEdit(cus)">
                  <i class="fa-solid fa-pencil"></i>
                </button>
              </td>
              <td>
                <button class="btn me-3" @click="removeCustomer(cus.id)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const customers = ref([]);
const newCustomer = ref({
  fullname: "",
  email: "",
  phone: "",
  password: "",
  is_active: true,
});

function createCustomer() {
  const now = new Date().toISOString();
  const cus = {
    id: Date.now(),
    fullname: newCustomer.value.fullname.trim(),
    email: newCustomer.value.email.trim(),
    phone: newCustomer.value.phone.trim(),
    is_active: newCustomer.value.is_active,
    created_at: now,
    updated_at: now,
  };
  if (!cus.fullname || !cus.email) return;
  customers.value = [cus, ...customers.value];
  newCustomer.value = {
    fullname: "",
    email: "",
    phone: "",
    password: "",
    is_active: true,
  };
}

function removeCustomer(id) {
  customers.value = customers.value.filter((c) => c.id !== id);
}

function startEdit(cus) {
  // chỗ móc để mở modal/screen edit
  console.log("Edit", cus);
}
</script>
