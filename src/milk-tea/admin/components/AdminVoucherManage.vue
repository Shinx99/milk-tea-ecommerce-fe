<template>
  <div class="container">
    <div class="row">
      <!-- Form -->
      <div class="col-sm-3">
        <div>
          <div class="mb-3">
            <label class="form-label fw-bold">Code:</label>
            <input type="text" class="form-control" v-model="form.code" readonly />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Discount Type:</label>
            <select class="form-control" v-model="form.discountType">
              <option value="percent">Percent</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Number:</label>
            <input type="number" class="form-control" v-model.number="form.number" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Start at:</label>
            <input type="date" class="form-control" v-model="form.startAt" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Expire at:</label>
            <input type="date" class="form-control" v-model="form.expireAt" />
          </div>

          <div class="mb-3 form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="checkNativeSwitch"
              v-model="form.isActive"
            />
            <label class="form-check-label fw-bold" for="checkNativeSwitch">Active</label>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Choose Product:</label>
            <input
              type="text"
              class="form-control"
              readonly
              :value="form.productLabel"
              @click="openProductModal"
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Choose Customer:</label>
            <input
              type="text"
              class="form-control"
              readonly
              :value="form.customerLabel"
              @click="openCustomerModal"
            />
          </div>

          <div class="d-flex justify-content-center">
            <button
              type="button"
              class="btn btn-light btn-lg rounded-pill w-20 border border-5"
              @click="createVoucher"
            >
              Create
            </button>
          </div>
        </div>
      </div>

      <!-- List -->
      <div class="col-sm-9">
        <table class="table table-light table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Discount Type</th>
              <th>Number</th>
              <th>Start at</th>
              <th>Expired at</th>
              <th>Active</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Create at</th>
              <th>Update at</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(v, index) in vouchers" :key="v.id">
              <td class="fw-bold">{{ index + 1 }}</td>
              <td>{{ v.code }}</td>
              <td>{{ v.discountType }}</td>
              <td>{{ v.number }}</td>
              <td>{{ v.startAt }}</td>
              <td>{{ v.expireAt }}</td>
              <td>{{ v.isActive ? 'Yes' : 'No' }}</td>
              <td>{{ v.customerLabel || '-' }}</td>
              <td>{{ v.productLabel || '-' }}</td>
              <td>{{ v.created_at }}</td>
              <td>{{ v.updated_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Modal -->
    <div class="modal fade" tabindex="-1" aria-hidden="true" ref="productModalRef" id="chooseProductModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Choose Product</h5>
            <button type="button" class="btn-close" @click="closeProductModal"></button>
          </div>
          <div class="modal-body">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Active</th>
                  <th>Choose</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, index) in products" :key="p.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ p.category_name }}</td>
                  <td>{{ p.slug }}</td>
                  <td>{{ p.is_active ? 'Yes' : 'No' }}</td>
                  <td>
                    <button class="btn btn-primary btn-sm" @click="selectProduct(p)">Select</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeProductModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Modal -->
    <div class="modal fade" tabindex="-1" aria-hidden="true" ref="customerModalRef" id="chooseCustomerModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Choose Customer</h5>
            <button type="button" class="btn-close" @click="closeCustomerModal"></button>
          </div>
          <div class="modal-body">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fullname</th>
                  <th>Email</th>
                  <th>Choose</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(c, index) in customers" :key="c.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ c.fullname }}</td>
                  <td>{{ c.email }}</td>
                  <td>
                    <button class="btn btn-primary btn-sm" @click="selectCustomer(c)">Select</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeCustomerModal">Close</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Modal } from 'bootstrap'

const vouchers = ref([])
const products = ref([])
const customers = ref([])

const form = reactive({
  code: '',
  discountType: 'percent',
  number: null,
  startAt: '',
  expireAt: '',
  isActive: false,
  productLabel: '',
  customerLabel: ''
})

const productModalRef = ref(null)
const customerModalRef = ref(null)
let productModalInstance = null
let customerModalInstance = null

onMounted(async () => {
  // demo data
  const res = await fetch('/admin_data/category.json').catch(() => null)
  products.value = res && res.ok ? await res.json() : []
  customers.value = [
    { id: 1, fullname: 'Alice', email: 'alice@example.com' },
    { id: 2, fullname: 'Bob', email: 'bob@example.com' }
  ]
  productModalInstance = new Modal(productModalRef.value)
  customerModalInstance = new Modal(customerModalRef.value)
})

function openProductModal() { productModalInstance.show() }
function closeProductModal() { productModalInstance.hide() }
function openCustomerModal() { customerModalInstance.show() }
function closeCustomerModal() { customerModalInstance.hide() }

function selectProduct(p) {
  form.productLabel = `${p.category_name} (${p.slug})`
  closeProductModal()
}

function selectCustomer(c) {
  form.customerLabel = `${c.fullname} <${c.email}>`
  closeCustomerModal()
}

function createVoucher() {
  const now = new Date().toISOString()
  vouchers.value.push({
    id: now,
    ...JSON.parse(JSON.stringify(form)),
    created_at: now,
    updated_at: now
  })
}
</script>
