<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增按钮和刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData"/>

        <!-- 主体 公告内容 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="title" label="公告标题" />
            <el-table-column prop="create_time" label="发布时间" width="380" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">

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

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title" placeholder="公告标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="form.content" placeholder="公告内容" type="textarea" :rows="5"></el-input>
                </el-form-item>
            </el-form>
            
        </FormDrawer>
    </el-card>
    
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '@/api/notice'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import ListHeader from '@/components/ListHeader.vue'

const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete
} = useInitTable({
    getList:getNoticeList,
    delete:deleteNotice
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
    update:updateNotice,
    create:createNotice,
    form: {
        title:'',
        content:''
    },
    rules:{
        title:[{
        required:true,
        trigger:blur,
        message:'公告标题不能为空'
    }],
    content:[{
        required:true,
        trigger:blur,
        message:'公告内容不能为空'
    }]
    }
})

</script>