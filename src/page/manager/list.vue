<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
            <SearchItem label="关键词">
                <el-input v-model="searchForm.keyword" placeholder="管理员昵称" clearable></el-input>
            </SearchItem>
        </Search>
        
        <!-- 新增按钮和刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData"/>
    
        <!-- 主体 管理员内容 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column  label="管理员" width="200">
                <template #default=" { row }">
                    <div class="flex items-center">
                        <el-avatar :size="40" :src="row.avatar" >
                        <img
                            src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                        />
                        </el-avatar>
                        <div class="ml-3 ">
                            <h6>{{ row.username }}</h6>
                            <small>ID:{{ row.id }}</small>
                        </div>
                    </div>
                    
                </template>
            </el-table-column>
            <el-table-column label="所属角色" align="center" >
                <template #default="{ row }">
                    {{ row.role?.name || '-' }}
                </template>
            </el-table-column>
            <el-table-column  label="状态" width="120">
                <template #default="{ row }"> 
                    <el-switch :modelValue="row.status" :active-value="1" 
                    :inactive-value="0" @change="handleStatusChange($event,row)"
                    :loading="row.statusLoading" :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <small v-if="scope.row.super == 1" class="text-sm text-gray-500">暂无操作</small>
                    <div v-else>
                        <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                        <el-popconfirm title="是否确认删除该公告？" confirm-button-text="确认" 
                        cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button type="primary" size="small" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>

                </template>
            </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="bottom">
            <el-pagination class="flex justify-center items-center mt-5" background layout="prev, pager, next" :total="total" 
            :current-page="currentPage" :page-size="limit" @current-change="getData" />
        </div>

        <!-- 抽屉表单 -->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="密码" type="password"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <ChooseImage v-model="form.avatar"/>
                </el-form-item>
                <el-form-item label="所属角色" prop="role_id">
                    <el-select v-model="form.role_id" placeholder="选择所属角色" >
                        <el-option v-for="item in roles"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    
                </el-form-item>
                <el-form-item label="状态" prop="content">
                   <el-switch v-model="form.status" :active-value="1" :inactive-value="0" @change="">
                   </el-switch>
                </el-form-item>
            </el-form>
            
        </FormDrawer>
    </el-card>
    
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import { getManagerList, updateManagerStatus, createManager, deleteManager, updateManager } from '@/api/manager'
import ChooseImage from '@/components/ChooseImage.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import ListHeader from '@/components/ListHeader.vue'
import Search from '@/components/Search.vue'
import SearchItem from '@/components/SearchItem.vue'

const roles = ref([])
const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    searchForm:{
        keyword:''
    },
    getList:getManagerList,
    onGetListSuccess:(res)=>{
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            return o
        })

        total.value = res.totalCount
        roles.value = res.roles
    },
    delete:deleteManager,
    updateStatus:updateManagerStatus
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
    update:updateManager,
    create:createManager,
    form: {
        username:'',
        password:'',
        role_id:null,
        status:1,
        avatar:''
    },
    rules:{
        username:[{
        required:true,
        trigger:blur,
        message:'管理员名称不能为空'
    }],
    password:[{
        required:true,
        trigger:blur,
        message:'密码不能为空'
    }]
    }
})

</script>