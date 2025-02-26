<script setup>
import { useAuthStore } from '../stores/auth'
import { useItemStore } from '../stores/itemStore'
import { useRouter } from 'vue-router'
import { onMounted, computed, ref } from 'vue'
import ItemCard from '../components/ItemCard.vue'
import ItemForm from '../components/ItemForm.vue'

const authStore = useAuthStore()
const itemStore = useItemStore()
const router = useRouter()

const searchQuery = ref('') // Search bar query
const selectedCategory = ref('') // Category filter

// Redirect to login if user is missing (handles refresh case)
if (!authStore.token) {
  router.push('/login')
} else {
  onMounted(() => {
    itemStore.fetchItems()
  })
}

// Filtered items based on search and category
const filteredItems = computed(() => {
  return itemStore.items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCategory = selectedCategory.value ? item.category === selectedCategory.value : true

    return matchesSearch && matchesCategory && item.user_id === authStore.user?.id
  })
})

// Unique categories for the dropdown
const uniqueCategories = computed(() => {
  const categories = [...new Set(itemStore.items.map((item) => item.category).filter(Boolean))]
  return categories.sort()
})

// Logout function
const logout = () => {
  authStore.logout()
  router.push('/login')
}

const goToProfile = () => {
  router.push('/profile')
}

const goToItem = (id) => {
  router.push(`/items/${id}`)
}

const refreshItems = () => {
  itemStore.fetchItems()
}
</script>

<template>
  <div class="fixed-content bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-white shadow-lg p-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Wardrobe Manager</h1>
      <div class="flex space-x-4">
        <button
          @click="goToProfile"
          class="login-button text-gray-600 hover:text-blue-600 transition"
        >
          Profile
        </button>
        <button
          @click="logout"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-3"
        >
          Logout
        </button>
      </div>
    </nav>

    <!-- Search & Filter Section -->
    <div class="p-6">
      <h2 class="text-3xl font-semibold text-gray-800">
        Welcome, {{ authStore.user?.name || 'User' }}! 🎉
      </h2>
      <p class="text-gray-600 mt-2">Here are your wardrobe items:</p>

      <div class="flex space-x-4 mt-4">
        <!-- Search Input -->
        <input
          v-model="searchQuery"
          placeholder="Search items..."
          class="border p-2 rounded w-full"
        />

        <!-- Category Filter -->
        <select v-model="selectedCategory" class="border p-2 rounded">
          <option value="">All Categories</option>
          <option v-for="category in uniqueCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <!-- Items Grid -->
    <div class="p-6">
      <div
        v-if="filteredItems.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <ItemCard v-for="item in filteredItems" :key="item.id" :item="item" :goToItem="goToItem" />
      </div>
      <p v-else class="text-gray-600 text-center mt-4">No items found.</p>
    </div>

    <!-- Add Item Form -->
    <div class="max-w-lg mx-auto mt-6">
      <ItemForm @itemAdded="refreshItems" />
    </div>
  </div>
</template>
