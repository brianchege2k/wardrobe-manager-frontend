<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const route = useRoute()
const router = useRouter()
const item = ref(null)
const editing = ref(false) // Track if user is in edit mode
const updatedItem = ref({ name: '', description: '' }) // Editable fields
const newImage = ref(null) // Store new image file

// Fetch item details on mount
onMounted(async () => {
  try {
    const res = await axios.get(`${apiBaseUrl}/api/items/${route.params.id}`)
    item.value = res.data

    // Initialize editable fields without modifying image
    updatedItem.value = {
      name: item.value.name,
      description: item.value.description,
    }
  } catch (error) {
    console.error('Error fetching item:', error)
  }
})

// Delete item
const deleteItem = async () => {
  try {
    await axios.delete(`${apiBaseUrl}/api/items/${route.params.id}`)
    router.push('/dashboard')
  } catch (error) {
    console.error('Error deleting item:', error)
  }
}

// Edit item - toggle edit mode
const startEditing = () => {
  editing.value = true
}

// Handle file selection
const handleImageUpload = (event) => {
  newImage.value = event.target.files[0]
}

// Save updated item
const updateItem = async () => {
  try {
    let formData = null

    if (newImage.value) {
      // Use FormData when a new image is uploaded
      formData = new FormData()
      formData.append('name', updatedItem.value.name)
      formData.append('description', updatedItem.value.description)
      formData.append('image', newImage.value)
    } else {
      // Send JSON if only text fields are updated
      formData = { ...updatedItem.value }
    }

    const response = await axios.put(`${apiBaseUrl}/api/items/${route.params.id}`, formData, {
      headers: newImage.value
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' },
    })

    item.value = response.data // Update displayed item
    editing.value = false // Exit edit mode
  } catch (error) {
    console.error('Failed to update item:', error)
  }
}
</script>

<template>
  <div class="fixed-content p-6">
    <div v-if="item" class="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <img :src="item.image" class="w-full h-60 object-cover rounded" />

      <!-- Show input fields when editing -->
      <div v-if="editing">
        <input v-model="updatedItem.name" class="w-full border p-2 rounded mt-2" />
        <textarea
          v-model="updatedItem.description"
          class="w-full border p-2 rounded mt-2"
        ></textarea>

        <!-- Image Upload Field -->
        <input
          type="file"
          class="w-full border p-2 rounded mt-2"
          @change="handleImageUpload"
          accept="image/*"
        />

        <div class="mt-4 flex gap-4">
          <button
            @click="updateItem"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            @click="editing = false"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Show details when not editing -->
      <div v-else>
        <h2 class="text-2xl font-semibold mt-3">{{ item.name }}</h2>
        <p class="text-gray-600">{{ item.description }}</p>

        <div class="mt-4 flex gap-4">
          <button
            @click="startEditing"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            @click="deleteItem"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
