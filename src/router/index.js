import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { zahtijevaPrijavu: true },
  },
  {
    path: '/event/novi',
    name: 'NoviEvent',
    component: () => import('@/views/NoviEventView.vue'),
    meta: { zahtijevaPrijavu: true },
  },
  {
    path: '/event/:id',
    name: 'EventDetalji',
    component: () => import('@/views/EventDetaljiView.vue'),
    meta: { zahtijevaPrijavu: true },
  },
  {
    path: '/chat/:id',
    name: 'Chat',
    component: () => import('@/views/ChatView.vue'),
    meta: { zahtijevaPrijavu: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard — provjeri prijavu prije svake rute
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (authStore.ucitavanje) {
    await authStore.inicijaliziraj()
  }

  if (to.meta.zahtijevaPrijavu && !authStore.jePrijavljen) {
    return { name: 'Login' }
  }

  if (to.name === 'Login' && authStore.jePrijavljen) {
    return { name: 'Home' }
  }
})

export default router
