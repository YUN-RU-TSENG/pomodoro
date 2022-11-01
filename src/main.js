import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { resetStore } from '@/utils/piniaReset'

import App from './App.vue'
import router from './router'

import '@/assets/style/reset.scss'

const pinia = createPinia()
pinia.use(resetStore)

const app = createApp(App)
app.use(pinia)
app.use(router)

app.mount('#app')
