import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    async register(userData) {
      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/register`, userData)
        // Registration successful, but don't log in automatically.
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed')
      }
    },

    async login(credentials) {
      try {
        const response = await axios.post(
          'https://wardrobe-management-backend-d697dac91515.herokuapp.com/api/login',
          credentials,
        )
        this.user = response.data.user
        this.token = response.data.token

        // Store user & token in localStorage
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', this.token)

        // Set Axios Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed')
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    restoreAuth() {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')

      if (storedUser && storedToken) {
        this.user = JSON.parse(storedUser)
        this.token = storedToken

        // Restore Axios Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }
    },
  },
})
