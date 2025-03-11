import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Ant from 'ant-design-vue'
import { notification } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(Ant)
app.use(pinia)

// 全局挂载通知组件
app.config.globalProperties.$notification = notification

// 为TypeScript提供类型支持
declare global {
  interface Window {
    $notification: typeof notification;
    debugLog: (msg: string, data?: any) => void;
  }
}

window.$notification = notification

// 添加全局调试日志
window.debugLog = (msg: string, data?: any) => {
  console.log(`[调试] ${msg}`, data || '');
}

app.mount('#app')

