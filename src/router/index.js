import { createWebHashHistory, createRouter } from 'vue-router'
import Admin from '@/layouts/admin.vue'
import Index from '@/page/index.vue'
import NotFound from '@/page/NotFound.vue'
import login from '@/page/login.vue'
import GoodList from '@/page/goods/list.vue'
import Category from '@/page/category/list.vue'
import UserList from '@/page/user/list.vue'
import OrderList from '@/page/order/list.vue'
import CommentList from '@/page/comment/list.vue'
import ImageList from '@/page/image/list.vue'
import NoticeList from '@/page/notice/list.vue'
import SettingBase from '@/page/setting/base.vue'
import CouponList from '@/page/coupon/list.vue'
import ManagerList from '@/page/manager/list.vue'
import AccessList from '@/page/access/list.vue'
import RoleList from '@/page/role/list.vue'
import SkusList from '@/page/skus/list.vue'
import LevelList from '@/page/level/list.vue'
import SettingBuy from '@/page/setting/buy.vue'
import SettingShip from '@/page/setting/ship.vue'
import DistributionIndex from '@/page/distribution/index.vue'
import DistributionSetting from '@/page/distribution/setting.vue'

// 默认路由
const routes = [
    {
        path: '/',
        component: Admin,
        name: 'admin'
    },
    {
        path: '/login',
        component: login,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: {
            title: '404'
        }
    }
]

// 动态路由
const asyncRoutes = [
    {
        path: '/',
        name:"/",
        component: Index,
        meta: {
            title: '后台首页'
        }
    },
    {
        path: '/goods/list',
        name:"/goods/list",
        component: GoodList,
        meta: {
            title: '商品管理'
        }
    },
    {
        path: '/category/list',
        name:"/category/list",
        component: Category,
        meta: {
            title: '分类列表'
        }
    },
    {
        path:"/user/list",
        name:"/user/list",
        component:UserList,
        meta:{
            title:"用户列表"
        }
    },
    {
        path:"/order/list",
        name:"/order/list",
        component:OrderList,
        meta:{
            title:"订单列表"
        }
    },
    {
        path:"/comment/list",
        name:"/comment/list",
        component:CommentList,
        meta:{
            title:"评价列表"
        }
    },
    {
        path:"/image/list",
        name:"/image/list",
        component:ImageList,
        meta:{
            title:"图库列表"
        }
    },
    {
        path:"/notice/list",
        name:"/notice/list",
        component:NoticeList,
        meta:{
            title:"公告列表"
        }
    },
    {
        path:"/setting/base",
        name:"/setting/base",
        component:SettingBase,
        meta:{
            title:"配置"
        }
    },
    {
        path:"/coupon/list",
        name:"/coupon/list",
        component:CouponList,
        meta:{
            title:"优惠券列表"
        }
    },
    {
        path:"/manager/list",
        name:"/manager/list",
        component:ManagerList,
        meta:{
            title:"管理员管理"
        }
    },
    {
        path:"/access/list",
        name:"/access/list",
        component:AccessList,
        meta:{
            title:"菜单权限管理"
        }
    },
    {
        path:"/role/list",
        name:"/role/list",
        component:RoleList,
        meta:{
            title:"角色管理"
        }
    },
    {
        path:"/skus/list",
        name:"/skus/list",
        component:SkusList,
        meta:{
            title:"规格模块"
        }
    },
    {
        path:"/level/list",
        name:"/level/list",
        component:LevelList,
        meta:{
            title:"会员等级"
        }
    },
    {
        path:"/setting/buy",
        name:"/setting/buy",
        component:SettingBuy,
        meta:{
            title:"支付设置"
        }
    },
    {
        path:"/setting/ship",
        name:"/setting/ship",
        component:SettingShip,
        meta:{
            title:"物流设置"
        }
    },
    {
        path:"/distribution/index",
        name:"/distribution/index",
        component:DistributionIndex,
        meta:{
            title:"分销员管理"
        }
    },
    {
        path:"/distribution/setting",
        name:"/distribution/setting",
        component:DistributionSetting,
        meta:{
            title:"分销设置"
        }
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 动态添加路由的方法
export function addRoutes(menus){
    // 是否有新路由
    let hasNewRoutes = false
    const findByMenus = (arr) =>{
        arr.forEach(e => {
            let item = asyncRoutes.find(o => o.path == e.frontpath)
            if(item && !router.hasRoute(item.path)){
                router.addRoute('admin',item)
                hasNewRoutes = true
            }
            if(e.child && e.child.length > 0){
                findByMenus(e.child)
            }
        });
    }
    findByMenus(menus)
    //console.log(router.getRoutes())
    return hasNewRoutes
}