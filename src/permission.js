import { router, addRoutes} from '@/router'
import {getToken} from '@/composables/auth'
import {toast, showFullLoading, hideFullLoading} from '@/composables/util'
import store from './store';
//权限验证
//全局前置守卫
let hasGetInfo = false // 避免重复调用getInfo 优化菜单加载速度
router.beforeEach(async(to, from, next) => {
    showFullLoading()

    const token = getToken()

    if(!token && to.path != '/login'){
        toast('请先登录','error')
        return next({path:'/login'})
    }
    if(token && to.path === '/login'){
        toast('请勿重复登录','error')
        return next({path:from.path})
    }

    // 获取登录信息
    let hasNewRoutes = false
    if(token && !hasGetInfo){
        let { menus } = await store.dispatch("getInfo")
        hasGetInfo = true
        // 动态添加路由
        hasNewRoutes = addRoutes(menus)
    }
    //console.log(hasNewRoutes)
    //网页标题
    let title = (to.meta.title ? to.meta.title : '未定义') + '-梦幻の岛'
    document.title = title
    
    hasNewRoutes ? next(to.fullPath) : next()
})
// 全局后置钩子
router.afterEach((to, from) => hideFullLoading());