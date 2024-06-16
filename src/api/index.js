import axios from '@/axios'

// 获取后台数据1
export function getStatistics1(){
    return axios.get('/admin/statistics1')
}

// 获取后台数据2 店铺交易信息
export function getStatistics2(){
    return axios.get('/admin/statistics2')
}

// 获取后台数据3 数据图表可视化
export function getStatistics3(type){
    return axios.get('/admin/statistics3?type='+type)
}

