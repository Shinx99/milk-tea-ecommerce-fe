<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-4">
        <h2 class="text-center mb-3">CREATE</h2>

        <div>
          <div class="mb-3">
            <div class="mb-3">
              <label class="form-label">Name:</label>
              <input type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Slug:</label>
              <input type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Sort Order:</label>
              <input type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="checkNativeSwitch"
                />
                <label class="form-check-label" for="checkNativeSwitch">
                  Active
                </label>
              </div>
            </div>
            <div class="d-flex justify-content-center">
              <button type="button" class="btn btn-secondary">Create</button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-8">
        <table class="table">
          <thead>
            <tr class="table-primary">
              <th scope="col">Name</th>
              <th scope="col">Slug</th>
              <th scope="col">Sort Order</th>
              <th scope="col">Active</th>
              <th scope="col">Create at</th>
              <th scope="col">Update at</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cat in categories"
              :key="cat.id"
              :class="cat.is_active ? 'table-secondary' : 'table-danger'"
            >
              <td>{{ cat.category_name }}</td>
              <td>{{ cat.slug }}</td>
              <td>{{ cat.sort_order }}</td>
              <td>{{ cat.is_active ? "Yes" : "No" }}</td>
              <td>{{ cat.created_at }}</td>
              <td>{{ cat.updated_at }}</td>
              <td>
                <button class="btn me-3">
                  <i class="fa-solid fa-pencil"></i>
                </button>

                <button class="btn me-3">
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
const categories = ref([]);

onMounted(async () => {
  try {
    const res = await fetch("/admin_data/category.json");
    if (!res.ok) throw new Error("Failed to fetch data");
    categories.value = await res.json();
  } catch (error) {
    console.error(error);
  }
});
</script>
