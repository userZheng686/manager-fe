import { createApp } from 'vue'
import router from './router'
import ElementPlus from 'element-plus'
import {ElMessage} from 'element-plus'
import config from './config'
import 'element-plus/lib/theme-chalk/index.css'
import request from './utils/request.js'
import storage from './utils/storage.js'
import store from './store'
import drag from './plugins/drag'
import has from './plugins/has'

import api from './api/index'
import App from './App.vue'
const app = createApp(App)

app.config.globalProperties.$request = request
app.config.globalProperties.$api = api
app.config.globalProperties.$storage = storage
app.config.globalProperties.$message = ElMessage
app.use(router).use(store).use(drag).use(has).use(ElementPlus,{size:'small'}).mount('#app')
