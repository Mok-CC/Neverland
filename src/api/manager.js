import axios from "@/axios";
import { queryParams } from '@/composables/util.js'

export function login(username,password){
    return axios.post('/admin/login',{
        username,
        password
    })
}
// 获取用户信息
export function getInfo(){
    return axios.post('/admin/getinfo')
}

// 退出登录
export function logout(){
    return axios.post('/admin/logout')
}

// 修改密码
export function updatePassword(data){
    return axios.post('admin/updatepassword',data)
}

// 管理员列表
export function getManagerList(page,query={}){
    let r = queryParams(query)
    return axios.get(`/admin/manager/${page}${r}`)
}

// 修改状态
export function updateManagerStatus(id,status){
    return axios.post(`/admin/manager/${id}/update_status`,{
        status
    })
}

export function createManager(data){
    return axios.post(`/admin/manager`,data)
}

export function updateManager(id,data){
    return axios.post(`/admin/manager/${id}`,data)
}

export function deleteManager(id){
    return axios.post(`/admin/manager/${id}/delete`)
}