<template>
    <el-drawer :title="drawerTitle" v-model="dialogVisible" size="70%">
        <el-form :model="searchForm" size="small">
            <el-form-item label="时间选择">
                <el-radio-group v-model="searchForm.type">
                    <el-radio-button value="all">全部</el-radio-button>
                    <el-radio-button value="today">今天</el-radio-button>
                    <el-radio-button value="yesterday">昨天</el-radio-button>
                    <el-radio-button value="last7days">最近7天</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker v-model="searchForm.starttime" placeholder="开始时间" style="width: 90%;"
                    value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="searchForm.endtime" placeholder="结束时间" style="width: 90%;"
                    value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="用户类型">
                <el-radio-group v-model="searchForm.level">
                    <el-radio-button :value="0">推广</el-radio-button>
                    <el-radio-button :value="1">一级推广</el-radio-button>
                    <el-radio-button :value="2">二级推广</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="getData">搜索</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 主体 管理员内容 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <template v-if="props.type === 'user'">
                <el-table-column label="ID" prop="id" align="center" />
                <el-table-column label="头像" width="65">
                    <template #default="{ row }">
                        <el-avatar :size="40" :src="row.avatar">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>

                    </template>
                </el-table-column>
                <el-table-column label="用户信息" prop="username" />
                <el-table-column lebel="推广数" prop="share_num" align="center" />
                <el-table-column lebel="推广订单数" prop="share_order_num" align="center" />
                <el-table-column lebel="绑定时间" prop="create_time" align="center" />
            </template>
            <template v-else>
                <el-table-column label="订单号">
                    <template #default="{ row }">
                        {{ row.order.no }}
                    </template>
                </el-table-column>
                <el-table-column label="用户名|昵称|手机">
                    <template #default="{ row }">
                        <div v-if="!row.order.user">
                            该用户已删除
                        </div>
                        <div v-else>
                            {{ row.order.user.username }}|{{  row.order.user.nickname }}|{{  row.order.user.phone }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="时间" prop="create_time"/>
                <el-table-column label="返佣金额" prop="commission"/>
            </template>
        </el-table>

        <!-- 分页 -->
        <div class="bottom">
            <el-pagination class="flex justify-center items-center mt-5" background layout="prev, pager, next"
                :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData" />
        </div>

    </el-drawer>

</template>
<script setup>
import { ref, computed } from 'vue'
import { getAgentList, getAgentOrderList } from '@/api/distribution'
import { useInitTable } from '@/composables/useCommon.js'

const props = defineProps({
    type:{
        type:String,
        default:'user'
    }
})
const drawerTitle = computed(()=>props.type === 'user' ? '推广人列表' : '推广订单列表')

const dialogVisible = ref(false)

const {
    searchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData
} = useInitTable({
    searchForm: {
        type: 'all',
        starttime: null,
        endtime: null,
        level: 0,
        user_id: 0
    },
    getList: (()=>{
        return props.type === 'user' ? getAgentList : getAgentOrderList
    })(),
    onGetListSuccess: (res) => {
        tableData.value = res.list
        total.value = res.totalCount
    }
})

// 此部分重置user_id不必重置，抽离出来写
const resetSearchForm=()=>{
    searchForm.type = 'all'
    searchForm.starttime = null
    searchForm.endtime = null
    searchForm.level = 0
}

const open = (id) => {
    dialogVisible.value = true
    searchForm.user_id = id
    getData()
}

const dataDrawerRef = ref(null)
const opendataDrawerRef = (id) => {
    dataDrawerRef.value.open(id)
}
defineExpose({
    open
})
</script>