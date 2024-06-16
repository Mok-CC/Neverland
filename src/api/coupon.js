import axios from '@/axios'

// 获取优惠卷列表数据
export function getCouponList(page) {
    return axios.get(`/admin/coupon/${page}`)
}

// 新增优惠卷
export function createCoupon(data) {
    return axios.post('/admin/coupon',data)
}
// 修改优惠卷
export function updateCoupon(id,data) {
    return axios.post("/admin/coupon/"+id,data)
}
// 删除优惠卷
export function deleteCoupon(id) {
    return axios.post(`/admin/coupon/${id}/delete`)
}

// 失效优惠卷
export function updateCouponStatus(id) {
    return axios.post(`/admin/coupon/${id}/update_status`,{
        status:0
    })
}
