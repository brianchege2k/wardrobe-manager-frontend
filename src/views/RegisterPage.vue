<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const errorMessage = ref(null)
const loading = ref(false)

const register = async () => {
  try {
    loading.value = true
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    })

    // Show success message and redirect after 2s
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    errorMessage.value = error.email ? error.email[0] : 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="fixed-content w-screen min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-4"
  >
    <div
      class="w-full max-w-md p-8 bg-gray-800 text-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
    >
      <h2 class="text-3xl font-bold text-center mb-6 text-blue-400">Create an Account 🚀</h2>

      <form @submit.prevent="register">
        <div v-if="errorMessage" class="mb-3 text-red-400 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div class="input-group">
          <input v-model="name" type="text" placeholder="Full Name" class="input-field" required />
          <span class="input-icon">👤</span>
        </div>

        <div class="input-group">
          <input v-model="email" type="email" placeholder="Email" class="input-field" required />
          <span class="input-icon">📧</span>
        </div>

        <div class="input-group">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="input-field"
            required
          />
          <span class="input-icon">🔑</span>
        </div>

        <div class="input-group mb-4">
          <input
            v-model="password_confirmation"
            type="password"
            placeholder="Confirm Password"
            class="input-field"
            required
          />
          <span class="input-icon">🔁</span>
        </div>

        <button
          type="submit"
          class="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="animate-spin h-5 w-5 border-t-2 border-white border-solid rounded-full mr-2"
          ></span>
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <p class="text-center text-gray-400 mt-4">
        Already have an account?
        <router-link to="/login" class="text-blue-400 hover:underline">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.input-group {
  position: relative;
  margin-bottom: 1rem;
}

.input-field {
  width: 100%;
  padding: 12px;
  padding-right: 40px;
  background-color: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}
</style>
