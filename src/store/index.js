import { createStore } from 'vuex'
import { getInfo,login } from '@/api/manager'
import { setToken, removeToken } from '@/composables/auth'

// 创建一个新的 store 实例
const store = createStore({
    state () {
      return {
        user: {},
        // 侧边宽度
        asidewidth: '250px',
        // 菜单数据和规则
        menus: [],
        ruleNames: []
      }
    },
    mutations: {
        SET_USERINFO(state,user){
            state.user = user
        },
        handleAsideWidth(state){
          state.asidewidth = state.asidewidth == '250px' ? '64px' : '250px'
        },
        SET_MENUS(state,menus){
          state.menus = menus
        },
        SET_RULENAMES(state,ruleNames){
          state.ruleNames = ruleNames
        },
    },

    actions:{
      //login
      login({commit},{username,password}){
        return new Promise((resolve,reject)=>{
          login(username,password).then(res=>{
            setToken(res.token)

            resolve(res)
          }).catch(err=>reject(err))
        })
      },
      // 获取登录信息
      getInfo({ commit }){
        return new Promise((resolve,reject)=>{
          getInfo().then(res=>{
            commit('SET_USERINFO',res)
            commit('SET_MENUS',res.menus)
            commit('SET_RULENAMES',res.ruleNames)
            // console.log(res)
            resolve(res)
          }).catch(err=>reject(err))
        })
      },
      // 退出登录
      logout({ commit }){
        // 移除cookie的token
        removeToken()    
        // 清除登录状态vuex
        commit('SET_USERINFO',{})
      }
    }
  })

export default store