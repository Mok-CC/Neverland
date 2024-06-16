<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
            <SearchItem label="关键词">
                <el-input v-model="searchForm.title" placeholder="商品标题" clearable></el-input>
            </SearchItem>
        </Search>
        
        <!-- 主体 管理员内容 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" default-expand-all>
            <el-table-column type="expand">
                <template #default="{ row }"> 
                    <div class="flex pl-18"> 
                        <el-avatar :src="row.user.avatar" fit="fill" :size="50" class="mr-3"></el-avatar>
                        <div class="flex-1">
                            <h6 class="flex items-center">
                                {{ row.user.nickname || row.user.username }}
                                <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                                <el-button size="small" class="ml-auto" @click="openTextarea(row)"
                                v-if="!row.textareaEdit && !row.extra">回复</el-button>
                                
                            </h6>
                            {{ row.review.data }}
                            <div class="py-2">
                                <el-image v-for="(item,index) in row.review.image" :key="index" 
                                :src="item" fit="cover" style="width: 100px; height: 100px;" 
                                class="rounded" :lazy="true"></el-image>
                            </div>
                            
                            <!-- 评论框 -->
                            <div v-if="row.textareaEdit">
                                <el-input v-model="textarea" placeholder="请输入评价内容" 
                                type="textarea" :rows="2">
                                </el-input>
                                <div class="py-2">
                                    <el-button type="primary" size="small" @click="review(row)">回复</el-button>
                                    <el-button size="small" class="ml-2" @click="row.textareaEdit = false">取消</el-button>
                                </div>
                            </div>

                            <template v-else>
                                <!-- 客服回复部分 -->
                                <div class="mt-3 bg-gray-100 rounded p-3" v-for="(item,index) in row.extra" :key="index">
                                    <h6 class="flex font-bold">
                                        客服
                                        <el-button type="info" size="small" class="ml-auto" @click="openTextarea(row,item.data)">修改</el-button>
                                    </h6>
                                    <p>{{ item.data }}</p>
                                </div>
                            </template>
                        </div>
                    </div> 
                </template>
            </el-table-column>

            <el-table-column label="ID" width="70" align="center" prop="id"/>
            <el-table-column  label="商品" >
                <template #default=" { row }">
                    <div class="flex items-center">
                        <el-image :src="row.goods_item ? row.goods_item.cover : ''" fit="fill"
                         :lazy="true" style="width: 50px; height: 50px;"></el-image>
                        <div class="ml-3 ">
                            <h6>{{ row.goods_item?.title ?? '商品已被删除' }}</h6>
                        </div>
                    </div>
                    
                </template>
            </el-table-column>
            <el-table-column label="评价信息" width="200" >
                <template #default="{ row }">
                   <div>
                    <p>用户：{{ row.user.nickname || row.user.username }}</p>
                    <p>
                        <el-rate
                        v-model="row.rating"
                        disabled
                        show-score
                        text-color="#ff9900"
                        />
                    </p>
                   </div>
                </template>
            </el-table-column>
            <el-table-column  label="评价时间" width="180" align="center" prop="review_time"/> 
            <el-table-column  label="状态" >
                <template #default="{ row }"> 
                    <el-switch :modelValue="row.status" :active-value="1" 
                    :inactive-value="0" @change="handleStatusChange($event,row)"
                    :loading="row.statusLoading" :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>

        </el-table>
        
        <!-- 分页 -->
        <div class="bottom">
            <el-pagination class="flex justify-center items-center mt-5" background layout="prev, pager, next" :total="total" 
            :current-page="currentPage" :page-size="limit" @current-change="getData" />
        </div>

    </el-card>
    
</template>
<script setup>
import { ref } from 'vue'
import { getGoodsCommentList, updateGoodsCommentStatus, reviewGoodsComment} from '@/api/goods_comment'
import { useInitTable } from '@/composables/useCommon.js'
import { toast } from '@/composables/util'
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
        title:''
    },
    getList:getGoodsCommentList,
    onGetListSuccess:(res)=>{
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            o.textareaEdit = false
            return o
        })

        total.value = res.totalCount
        roles.value = res.roles
    },
    updateStatus:updateGoodsCommentStatus
})

const textarea = ref('')
const openTextarea = (row,data='')=>{
    textarea.value = data
    row.textareaEdit = true
}

const review =(row)=>{
    if(textarea.value == ''){
        return(toast('回复内容不能为空'))
    }
    reviewGoodsComment(row.id,textarea.value)
    .then(res=>{
        row.textareaEdit = false
        toast('回复成功')
        getData()
    })
}
</script>