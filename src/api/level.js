import axios from '@/axios'

// 获取会员列表数据
export function getLevelList(page) {
    return axios.get(`/admin/user_level/${page}`)
}

// 新增会员
export function createLevel(data) {
    return axios.post('/admin/user_level',data)
}
// 修改会员
export function updateLevel(id,data) {
    return axios.post(`/admin/user_level/${id}`,data)
}
// 删除会员
export function deleteLevel(id) {
    return axios.post(`/admin/user_level/${id}/delete`)
}

// 修改会员状态
export function updateLevelStatus(id,status){
    return axios.post(`/admin/user_level/${id}/update_status`,{
        status
    })
}
