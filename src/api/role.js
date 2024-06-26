import axios from '@/axios'

// 获取角色列表数据
export function getRoleList(page) {
    return axios.get(`/admin/role/${page}`)
}

// 新增角色
export function createRole(data) {
    return axios.post('/admin/role',data)
}
// 修改角色
export function updateRole(id,data) {
    return axios.post(`/admin/role/${id}`,data)
}
// 删除角色
export function deleteRole(id) {
    return axios.post(`/admin/role/${id}/delete`)
}

// 修改状态
export function updateRoleStatus(id,status){
    return axios.post(`/admin/role/${id}/update_status`,{
        status
    })
}

// 设置用户权限
export function setRoleRules(id,rule_ids){
    return axios.post(`/admin/role/set_rules`,{
        id,rule_ids
    })
}