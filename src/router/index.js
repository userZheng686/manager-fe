import {createRouter,createWebHashHistory} from 'vue-router'
import storage from '../utils/storage'
import API from '../api/index'
import util from '../utils/utils'

const routes = [
    {
        name : 'home',
        path : '/',
        component : () => import('@/components/Home.vue'),
        redirect : {
            name : 'welcome'
        },
        meta : {
            title : '首页'
        },
        children : [
            {
                name : 'welcome',
                path : '/welcome',
                component: () => import('@/views/Welcome.vue'),
                meta : {
                    title : '欢迎页'
                }
            },
        ]
    },
    {
        name : 'login',
        path : '/login',
        meta : {
            title : '登录'
        },
        component : () => import('@/views/login.vue')
    },
    {
        name : '404',
        path : '/404',
        meta : {
            title : '页面不存在'
        },
        component : () => import('@/views/404.vue')
    }
]

const router = createRouter({
    history : createWebHashHistory(),
    routes
})

async function loadAsyncRoutes(){
    let userInfo = storage.getItem('userInfo') || {}
    if(userInfo.token){
        try {
            const menuList = await API.getMenuList()
            console.log(menuList)
            let routes = util.generateRoute(menuList)
            routes.map(route => {
                let url = `./../views/${route.component}.vue`
                route.component = () => import(url)
                router.addRoute("home",route)
            })
        }catch(error){

        }
    }
}

await loadAsyncRoutes()

router.beforeEach((to,from,next) => {
    if(router.hasRoute(to.name)){
        document.title = to.meta.title
        next()
    }else{
        next('/404')
    }
})

export default router