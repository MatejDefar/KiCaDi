/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/stores/authStore'
declare module '@/stores/eventiStore'
declare module '@/stores/chatStore'
declare module '@/firebase/config'
declare module '@/router/index.js'
