<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref(null)
const loading = ref(false) // Added loading state

const login = async () => {
  loading.value = true // Start loading
  errorMessage.value = null // Clear previous errors

  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message || 'Invalid credentials'
  } finally {
    loading.value = false // Stop loading after request completes
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-gradient-to-r from-blue-500 to-purple-600">
    <div class="flex items-center justify-center min-h-full w-full overflow-y-auto">
      <div
        class="bg-white dark:bg-gray-800 w-full max-w-md p-10 rounded-2xl shadow-xl text-center my-10"
      >
        <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mt-8">Welcome Back 👋</h2>

        <form @submit.prevent="login" class="space-y-6">
          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="p-4 bg-red-100 dark:bg-red-700 rounded-md text-center text-red-700 dark:text-red-200"
          >
            {{ errorMessage }}
          </div>

          <div class="input-group">
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Email"
              class="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
              required
            />
          </div>

          <div class="input-group">
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Password"
              class="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
              required
            />
          </div>

          <!-- Sign In Button -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="loading"
                class="w-5 h-5 mr-2 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-dasharray="31.415, 31.415"
                  stroke-linecap="round"
                ></circle>
              </svg>
              {{ loading ? 'Signing In...' : 'Sign In' }}
            </button>
          </div>
        </form>

        <p class="mt-6 text-gray-600 dark:text-gray-300">
          Don't have an account?
          <router-link to="/register" class="text-indigo-500 hover:underline">Sign Up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
