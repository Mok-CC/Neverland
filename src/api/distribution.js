import axios from "@/axios"
import { queryParams } from '@/composables/util.js'

// 分销员列表
export function getAgentList(page,query={}){
    let r = queryParams(query)
    return axios.get(`/admin/agent/${page}${r}`)
}

// 推广人列表
export function getAgentOrderList(page,query={}){
    let r = queryParams(query)
    return axios.get(`/admin/user_bill/${page}${r}`)
}

export function getAgentStatistics(){
    return axios.get('/admin/agent/statistics')
}

// 分销设置
export function getConfig(){
    return axios.get('/admin/distribution_setting/get')
}

export function setConfig(data){
    return axios.post('/admin/distribution_setting/set',data)
}