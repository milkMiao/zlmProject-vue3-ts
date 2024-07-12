import './assets/main.css'

import { createApp } from 'vue' //每个Vue应用都是通过 createApp 函数创建一个新的（应用实例）
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App) //App：根组件选项

app.use(createPinia())
app.use(router)

app.mount('#app') //挂载应用
