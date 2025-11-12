import './assets/main.css'
import 'vxe-table/lib/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import VXETable from 'vxe-table'
import 'xe-utils'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(VXETable)
app.mount('#app')
