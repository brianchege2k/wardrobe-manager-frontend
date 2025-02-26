import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import ItemDetails from '../views/ItemDetails.vue'
import ProfilePage from '../views/ProfilePage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/items/:id', component: ItemDetails, props: true },
  {
    path: '/dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }, // Protect dashboard
  },
  {
    path: '/profile',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guard: Redirect unauthenticated users
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login') // Redirect to login if not authenticated
  } else {
    next()
  }
})

export default router
