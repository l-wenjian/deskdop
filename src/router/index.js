import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export let routeList = [
    {
        path: '',
        component: () => import ('@/pages/index'),
        meta: {},
    },
    {
        path: '/frame',
        name:'frame',
        component: () => import ('@/pages/frame'),
        meta: {},
    },
    {
        path: '/login',
        name:'login',
        component: () => import ('@/pages/login'),
        meta: {},
    },
]

export default new Router({
    routes: routeList
})

