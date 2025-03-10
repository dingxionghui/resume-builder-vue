import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Ant from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(Ant)
app.use(pinia)
app.mount('#app')

