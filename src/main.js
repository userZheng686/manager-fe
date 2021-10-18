import { createApp } from 'vue'
import router from './router'
import ElementPlus from 'element-plus'
import axios from 'axios'
import config from './config'
import 'element-plus/lib/theme-chalk/index.css'
import request from './utils/request.js'
import storage from './utils/storage.js'

import App from './App.vue'
const app = createApp(App)
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.use(router).use(ElementPlus).mount('#app')
