import { createApp } from 'vue'
import router from './router'
import ElementPlus from 'element-plus'
import axios from 'axios'
import config from './config'
import 'element-plus/lib/theme-chalk/index.css'
import App from './App.vue'

createApp(App).use(router).use(ElementPlus).mount('#app')
