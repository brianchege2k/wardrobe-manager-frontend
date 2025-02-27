import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export const useItemStore = defineStore('itemStore', {
  state: () => ({
    items: [],
    searchQuery: '', // Search bar query
    selectedCategory: '', // New: Category filter
    loading: false,
    error: null,
  }),

  getters: {
    filteredItems(state) {
      return state.items.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          item.category?.toLowerCase().includes(state.searchQuery.toLowerCase())

        const matchesCategory = state.selectedCategory
          ? item.category === state.selectedCategory
          : true

        return matchesSearch && matchesCategory
      })
    },
  },

  actions: {
    // Fetch Items from API
    async fetchItems() {
      this.loading = true
      this.error = null

      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.get(`${apiBaseUrl}/api/items`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.items = response.data
      } catch (error) {
        console.error('Error fetching items:', error.response?.data || error)
        this.error = 'Failed to load items'
      } finally {
        this.loading = false
      }
    },

    // Add New Item
    async addItem(itemData) {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.post(`${apiBaseUrl}/api/items`, itemData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Important for image upload
          },
        })

        this.items.push(response.data) // Instantly add new item to dashboard
      } catch (error) {
        console.error('Error adding item:', error.response?.data || error)
        this.error = 'Failed to add item'
      }
    },

    // Update Item
    async updateItem(itemId, updatedData) {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.put(`${apiBaseUrl}/api/items/${itemId}`, updatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Support for image uploads
          },
        })

        // Update item in local state
        const index = this.items.findIndex((item) => item.id === itemId)
        if (index !== -1) {
          this.items[index] = response.data
        }
      } catch (error) {
        console.error('Error updating item:', error.response?.data || error)
        this.error = 'Failed to update item'
      }
    },

    // Delete Item
    async deleteItem(itemId) {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        await axios.delete(`${apiBaseUrl}/api/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Remove deleted item from local state
        this.items = this.items.filter((item) => item.id !== itemId)
      } catch (error) {
        console.error('Error deleting item:', error.response?.data || error)
        this.error = 'Failed to delete item'
      }
    },
  },
})
