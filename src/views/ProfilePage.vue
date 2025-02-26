<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const goBack = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="fixed-content h-screen w-screen bg-gray-100 p-6">
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-semibold text-gray-800">Profile</h2>
      <p class="text-gray-500">Manage your account details</p>

      <div class="mt-4">
        <p><strong>Name:</strong> {{ authStore.user?.name }}</p>
        <p><strong>Email:</strong> {{ authStore.user?.email }}</p>
      </div>

      <button
        @click="goBack"
        class="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
</template>
