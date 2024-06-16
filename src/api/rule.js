import axios from '@/axios'

// 获取权限列表数据
export function getRuleList() {
    return axios.get('/admin/rule/1')
}

// 新增权限
export function createRule(data) {
    return axios.post('/admin/rule',data)
}
// 修改权限
export function updateRule(id,data) {
    return axios.post(`/admin/rule/${id}`,data)
}

// 修改状态
export function updateRuleStatus(id,status){
    return axios.post(`/admin/rule/${id}/update_status`,{
        status
    })
}

export function deleteRule(id){
    return axios.post(`/admin/rule/${id}/delete`)
}