import {createRouter,createWebHashHistory} from 'vue-router'


const routes = [
    {
        name : 'home',
        path : '/',
        component : () => import('./../components/Home.vue'),
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
                component: () => import('../views/Welcome.vue'),
                meta : {
                    title : '欢迎页'
                }
            }
        ]
    },
    {
        name : 'login',
        path : '/login',
        meta : {
            title : '登录'
        },
        component : () => import('./../views/login.vue')
    }
]

const router = createRouter({
    history : createWebHashHistory(),
    routes
})

export default router