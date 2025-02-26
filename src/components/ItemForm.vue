<script setup>
import { ref } from 'vue'
import { useItemStore } from '../stores/itemStore'

const itemStore = useItemStore()
const emit = defineEmits(['itemAdded'])

const name = ref('')
const description = ref('')
const category = ref('')
const image = ref(null) // File input

const handleImageUpload = (event) => {
  image.value = event.target.files[0] // Capture image file
}

const submitForm = async () => {
  if (!name.value || !description.value || !category.value) {
    return alert('All fields are required!')
  }

  const formData = new FormData()
  formData.append('name', name.value)
  formData.append('description', description.value)
  formData.append('category', category.value)
  if (image.value) {
    formData.append('image', image.value) // Attach image file
  }

  await itemStore.addItem(formData) // Send FormData

  emit('itemAdded') // Notify parent component to refresh items

  // Clear form after submission
  name.value = ''
  description.value = ''
  category.value = ''
  image.value = null
}
</script>

<template>
  <div class="bg-white p-4 shadow rounded-lg">
    <h3 class="text-xl font-semibold text-gray-800 mb-2">Add New Item</h3>

    <input v-model="name" placeholder="Item Name" class="input-group w-full border p-2 rounded" />
    <input
      v-model="description"
      placeholder="Description"
      class="input-group w-full border p-2 rounded mb-2"
    />

    <!-- Category Dropdown -->
    <select v-model="category" class="input-group w-full border p-2 rounded">
      <option value="" disabled>Select Category</option>
      <option value="Clothing">Clothing</option>
      <option value="Accessories">Accessories</option>
      <option value="Shoes">Shoes</option>
      <option value="Other">Other</option>
    </select>

    <!-- Image Upload -->
    <input type="file" @change="handleImageUpload" class="w-full border p-2 rounded input-group" />

    <button
      @click="submitForm"
      class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
    >
      Add Item
    </button>
  </div>
</template>
