import axios from "@/axios";
import { queryParams } from '@/composables/util.js'

// 商品列表
export function getGoodsList(page,query={}){
    let r = queryParams(query)
    return axios.get(`/admin/goods/${page}${r}`)
}

// 批量上架和下架
export function updateGoodsStatus(ids,status){
        return axios.post(`/admin/goods/changestatus`,{
            ids,
            status
    })
}

export function createGoods(data){
    return axios.post(`/admin/goods`,data)
}

export function updateGoods(id,data){
    return axios.post(`/admin/goods/${id}`,data)
}

export function deleteGoods(ids){
    return axios.post(`/admin/goods/delete_all`,{
        ids
    })
}


// 批量恢复
export function restoreGoods(ids){
    return axios.post(`/admin/goods/restore`,{
        ids
    })
}

// 彻底删除 
export function destroyGoods(ids){
    return axios.post(`/admin/goods/destroy`,{
        ids
    })
}

// 商品资料
export function readGoods(id){
    return axios.get(`/admin/goods/read/${id}`)
}

// 设置商品轮播图
export function setGoodsBanner(id,data){
    return axios.post(`/admin/goods/banners/${id}`,data)
}
// 更新商品规格
export function updateGoodsSkus(id,data){
    return axios.post(`/admin/goods/updateskus/${id}`,data)
}

// 添加商品规格
export function createGoodsSkusCard(data){
    return axios.post(`/admin/goods_skus_card`,data)
}

// 修改商品规格
export function updateGoodsSkusCard(id,data){
    return axios.post(`/admin/goods_skus_card/${id}`,data)
}

// 删除商品规格
export function deleteGoodsSkusCard(id){
    return axios.post(`/admin/goods_skus_card/${id}/delete`)
}

// 排序商品规格
export function sortGoodsSkusCard(data){
    return axios.post(`/admin/goods_skus_card/sort`,data)
}

// 添加商品规格的值
export function createGoodsSkusCardValue(data){
    return axios.post(`/admin/goods_skus_card_value`,data)
}

// 修改商品规格的值
export function updateGoodsSkusCardValue(id,data){
    return axios.post(`/admin/goods_skus_card_value/${id}`,data)
}

// 删除商品规格的值
export function deleteGoodsSkusCardValue(id){
    return axios.post(`/admin/goods_skus_card_value/${id}/delete`)
}

// 选择设置商品规格选项和值
export function chooseAndSetGoodsCard(id,data){
    return axios.post(`/admin/goods_skus_card/${id}/set`,data)
}