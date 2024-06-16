import axios from "@/axios";
import { queryParams } from '@/composables/util.js'

export function login(username,password){
    return axios.post('/admin/login',{
        username,
        password
    })
}

// 评论列表
export function getGoodsCommentList(page,query={}){
    let r = queryParams(query)
    return axios.get(`/admin/goods_comment/${page}${r}`)
}

// 修改状态
export function updateGoodsCommentStatus(id,status){
    return axios.post(`/admin/goods_comment/${id}/update_status`,{
        status
    })
}

// 修改状态
export function reviewGoodsComment(id,data){
    return axios.post(`/admin/goods_comment/review/${id}`,{
        data
    })
}