import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

import '../src/assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Restore auth state before mounting the app
const authStore = useAuthStore()
authStore.restoreAuth()
app.mount('#app')
