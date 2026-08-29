import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import { useAuthStore } from './stores/authStore.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicijaliziraj Firebase auth listener prije mountanja
const authStore = useAuthStore()
authStore.inicijaliziraj().then(() => {
  app.mount('#app')
})
