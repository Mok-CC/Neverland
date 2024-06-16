<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增按钮和刷新 -->
        <ListHeader @create="handleCreate" @refresh="getData" />

        <!-- 主体 公告内容 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="会员等级" />
            <el-table-column prop="discount" label="折扣率" align="center" />
            <el-table-column prop="level" label="等级序号" align="center" />
            <el-table-column label="状态" width="120">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="handleStatusChange($event, row)" :loading="row.statusLoading"
                        :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">

                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                    <el-popconfirm title="是否确认删除该会员记录？" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" text>删除</el-button>
                        </template>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="bottom">
            <el-pagination class="flex justify-center items-center mt-5" background layout="prev, pager, next"
                :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData" />
        </div>

        <!-- 新增修改面板 -->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="等级名称" prop="name">
                    <el-input v-model="form.name" placeholder="等级名称"></el-input>
                </el-form-item>
                <el-form-item label="等级权重" prop="level">
                    <el-input type="number" v-model="form.level" placeholder="等级权重"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="升级条件">
                    <div>
                        <small class="text-xs mr-2">累计消费满</small>
                        <el-input type="number" v-model="form.max_price" placeholder="累计消费" style="width: 50%;">
                            <template #append>元</template>
                        </el-input>
                        <small class="text-gray-400 flex">
                            设置会员等级累计消费必须大于等于0，单位：元
                        </small>
                    </div>
                    <div>
                        <small class="text-xs mr-2">累计次数满</small>
                        <el-input type="number" v-model="form.max_times" placeholder="累计次数" style="width: 50%;">
                            <template #append>次</template>
                        </el-input>
                        <small class="text-gray-400 flex">
                            设置会员等级累计消费必须大于等于0，单位：元
                        </small>
                    </div>
                </el-form-item>
                <el-form-item label="折扣率(%)" prop="discount">
                    <el-input type="number" v-model="form.discount" placeholder="折扣率(%)" style="width: 50%;">
                        <template #append>
                            %
                        </template>
                    </el-input>
                    <small class="text-gray-400 flex">
                        折扣率单位为百分比
                    </small>
                </el-form-item>

            </el-form>

        </FormDrawer>

    </el-card>

</template>
<script setup>
import { ref } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import { getLevelList, createLevel, updateLevel, deleteLevel, updateLevelStatus } from '@/api/level.js'
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
    getList: getLevelList,
    delete: deleteLevel,
    updateStatus: updateLevelStatus
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
    update: updateLevel,
    create: createLevel,
    form: {
        name: '',
        level: 100,
        status: 1,
        discount: 0,
        max_price: 0,
        max_times: 0
    },
    rules: {
        name: [{
            required: true,
            trigger: blur,
            message: '会员等级名称不能为空'
        }]
    }
})


</script>