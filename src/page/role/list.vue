<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增按钮和刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData"/>

        <!-- 主体 公告内容 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="desc" label="角色描述" width="380" />
            <el-table-column  label="状态" width="120">
                <template #default="{ row }"> 
                    <el-switch :modelValue="row.status" :active-value="1" 
                    :inactive-value="0" @change="handleStatusChange($event,row)"
                    :loading="row.statusLoading" :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="openSetRule(scope.row)">配置权限</el-button>
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                    <el-popconfirm title="是否确认删除该公告？" confirm-button-text="确认" 
                    cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" text>删除</el-button>
                        </template>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="bottom">
            <el-pagination class="flex justify-center items-center mt-5" background layout="prev, pager, next" :total="total" 
            :current-page="currentPage" :page-size="limit" @current-change="getData" />
        </div>

        <!-- 新增修改面板 -->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="角色描述" type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>  
                </el-form-item>

            </el-form>
            
        </FormDrawer>
        
        <!-- 权限配置 -->
        <FormDrawer ref="setRuleFormDrawerRef" title="权限配置" @submit="handleSetSubmit">
            <el-tree-v2
              :check-strictly="checkStrictly"
              ref="elTreeRef"
              node-key="id"
              :default-expanded-keys="defaultExpandedKeys"
              :data="ruleList"
              :props="{ label:'name',children:'child' }"
              show-checkbox
              :height="treeHeight"
              @check="handleTreeCheck"
            >
            <template #default="{ node, data }">
                <div class="flex items-center">
                    <el-tag :type="data.menu ? 'primary' : 'info'" size="small">
                        {{ data.menu ? '菜单' : '权限' }}
                    </el-tag>
                    <span class="ml-2 text-sm">{{ data.name }} </span>
                </div>
              <span>{{ node.label }}</span>
            </template>
            </el-tree-v2>
            
        </FormDrawer>
    </el-card>
    
</template>
<script setup>
import { ref } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import { getRoleList, createRole, updateRole, deleteRole, updateRoleStatus, setRoleRules } from '@/api/role.js'
import { getRuleList } from '@/api/rule'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import ListHeader from '@/components/ListHeader.vue'
import { toast } from "@/composables/util"

const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList:getRoleList,
    delete:deleteRole,
    updateStatus:updateRoleStatus
})

const {
    formDrawerRef,
    formRef,
    form,
    rules,
    drawerTitle,
    handleSubmit,
    handleCreate,
    handleEdit
} = useInitForm({
    getData,
    update:updateRole,
    create:createRole,
    form: {
        name:'',
        desc:'',
        status:1
    },
    rules:{
        name:[{
        required:true,
        trigger:blur,
        message:'角色名称不能为空'
    }]
    }
})

const setRuleFormDrawerRef = ref(null)
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const defaultExpandedKeys = ref([])
const elTreeRef = ref(null)
// 当前用户权限id
const ruleIds = ref([])
const checkStrictly = ref(false)

// 权限配置
const openSetRule = (row)=>{
    roleId.value = row.id
    treeHeight.value = window.innerHeight - 180
    checkStrictly.value = true

    getRuleList(1).then(res=>{
        ruleList.value = res.list
        defaultExpandedKeys.value = res.list.map(o=>o.id)
        setRuleFormDrawerRef.value.open()

        // 打开之后渲染出来才能拿到当前角色的id
        ruleIds.value = row.rules.map(o=>o.id)
        setTimeout(() => {
            elTreeRef.value.setCheckedKeys(ruleIds.value)
            checkStrictly.value = false
        }, 150);
    })
}


const handleSetSubmit = ()=>{
    setRuleFormDrawerRef.value.showLoading()
    setRoleRules(roleId.value,ruleIds.value)
    .then(res=>{
        toast('配置成功')
        getData()
        setRuleFormDrawerRef.value.close()
    })
    .finally(()=>{
        setRuleFormDrawerRef.value.hideLoading()
    })
}

const handleTreeCheck =(...e)=>{
    const {checkedKeys,halfCheckedKeys} = e[1]
    ruleIds.value = [...checkedKeys,...halfCheckedKeys]
}
</script>