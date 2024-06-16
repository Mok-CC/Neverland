<template>
    <div>
        <el-tabs v-model="searchForm.tab" @tab-change="getData">
            <el-tab-pane :label="item.name" :name="item.key" v-for="(item, index) in tabbars" :key="index" />
        </el-tabs>

        <el-card shadow="never" class="border-0">
            <!-- 搜索 -->
            <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
                <SearchItem label="商品名称">
                    <el-input v-model="searchForm.title" placeholder="商品名称" clearable></el-input>
                </SearchItem>

                <template #show>
                    <SearchItem label="商品分类">
                        <el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
                            <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </SearchItem>

                </template>
            </Search>

            <!-- 新增按钮和刷新 -->
            <ListHeader layout="create,refresh" @create="handleCreate" @refresh="getData" >
                <el-button  type="danger" size="small" @click="handleMultiDelete" v-if="searchForm.tab !== 'delete'">批量删除</el-button>
                <el-button  type="warning" size="small" @click="handleRestoreGoods" v-else>恢复商品</el-button>

                <el-popconfirm v-if="searchForm.tab === 'delete'" title="是否彻底删除该商品？" confirm-button-text="确认" cancel-button-text="取消"
                    @confirm="handleDestroyGoods">
                    <template #reference>
                        <el-button  type="danger" size="small" >彻底删除</el-button>
                    </template>
                </el-popconfirm>


                <el-button  size="small" @click="handleMultiStatusChange(1)" v-if="searchForm.tab === 'all' || searchForm.tab === 'off'">上架</el-button>
                <el-button  size="small" @click="handleMultiStatusChange(0)" v-if="searchForm.tab === 'all' || searchForm.tab === 'saling'">下架</el-button>
                
            </ListHeader>

            <!-- 主体 管理员内容 -->
            <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <div class="flex ">
                            <el-image class="mr-3 rounder " :src="row.cover" style="width: 50px; height: 50px;"
                                fit="cover" :lazy="true"></el-image>
                            <div class="flex-1">
                                <p>{{ row.title }}</p>
                                <div>
                                    <span class="text-rose-500">￥{{ row.min_price }}</span>
                                    <el-divider direction="vertical" />
                                    <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                                </div>
                                <p class="text-gray-400 text-xs mb-1">分类：{{ row.category ? row.category.name : '未分类' }}
                                </p>
                                <p class="text-gray-400 text-xs">创建时间：{{ row.create_time }}</p>
                            </div>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column label="实际销量" width="90" prop="sale_count" align="center" />
                <el-table-column label="商品状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" size="small">{{ row.status ? '上架' : '仓库'
                            }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="审核状态" width="120" v-if="searchForm.tab !== 'delete'" align="center">
                    <template #default="{ row }">
                        <div v-if="row.ischeck === 0">
                            <el-button type="success" size="small" plain>审核通过</el-button>
                            <el-button class="mt-2 !ml-0" type="danger" size="small" plain>审核拒绝</el-button>
                        </div>
                        <span v-else>{{ row.ischeck == 1 ? '通过' : '拒绝' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="总库存" width="90" prop="stock" align="center" />

                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <div v-if="searchForm.tab !== 'delete'">
                            <el-button class="px-1" type="primary" size="small" text
                                @click="handleEdit(scope.row)">修改</el-button>
                            <el-button class="px-1"  size="small" text 
                            :loading="scope.row.skusLoading" @click="handleSetGoodsSkus(scope.row)"
                            :type="(scope.row.sku_type == 0 && !scope.row.sku_value || (scope.row.sku_type == 1 && !scope.row.goods_skus.length )) ? 'danger' : 'primary'">
                                商品规格
                            </el-button>
                            <el-button class="px-1" :type="scope.row.goods_banner.length === 0 ? 'danger' : 'primary'" size="small" text 
                            @click="handleSetGoodsBanners(scope.row)" :loading="scope.row.bannersLoading" >
                                设置轮播图
                            </el-button>
                            <el-button class="px-1" :type="scope.row.content? 'primary' : 'danger'" 
                            size="small" text @click="handleSetGoodsContent(scope.row)" :loading="scope.row.contentLoading">
                                商品详情
                            </el-button>
                            <el-popconfirm title="是否确认删除该商品？" confirm-button-text="确认" cancel-button-text="取消"
                                @confirm="handleDelete([scope.row.id])">
                                <template #reference>
                                    <el-button class="px-1" type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <span v-else>暂无操作</span>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="bottom">
                <el-pagination class="flex justify-center items-center mt-5" background layout="prev, pager, next"
                    :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData" />
            </div>

            <!-- 抽屉表单 -->
            <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
                <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                    <el-form-item label="商品名称" prop="title">
                        <el-input v-model="form.title" placeholder="请输入商品名称，不超过60个字符"></el-input>
                    </el-form-item>
                    <el-form-item label="封面" prop="cover">
                        <ChooseImage v-model="form.cover" />
                    </el-form-item>
                    <el-form-item label="商品分类" prop="category_id">
                        <el-select v-model="form.category_id" placeholder="请选择商品分类">
                            <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品描述" prop="desc">
                        <el-input v-model="form.desc" placeholder="选填商品卖点" type="textarea" row="2"></el-input>
                    </el-form-item>
                    <el-form-item label="单位" prop="unit">
                        <el-input v-model="form.unit" placeholder="请输入单位" style="width: 50%;"></el-input>
                    </el-form-item>
                    <el-form-item label="总库存" prop="stock">
                        <el-input v-model="form.stock" type="number" style="width: 40%;">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存预警" prop="min_stock">
                        <el-input v-model="form.min_stock" type="number" style="width: 40%;">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低销售" prop="min_price">
                        <el-input v-model="form.min_price" type="number" style="width: 40%;">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低原价" prop="min_oprice">
                        <el-input v-model="form.min_oprice" type="number" style="width: 40%;">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存显示" prop="min_oprice">
                        <el-radio-group v-model="form.stock_display" >
                            <el-radio  :label="0" border>隐藏</el-radio>
                            <el-radio  :label="1" border>显示</el-radio>          
                        </el-radio-group>                        
                    </el-form-item>
                    <el-form-item label="是否上架" prop="status">
                        <el-radio-group v-model="form.status" >
                            <el-radio  :label="0" border>仓库</el-radio>
                            <el-radio  :label="1" border>上架</el-radio>          
                        </el-radio-group>
                    </el-form-item>
                </el-form>

            </FormDrawer>
        </el-card>

        <banners ref="bannersRef" @reload-data="getData"></banners>
        <content ref="contentRef" @reload-data="getData"></content>
        <skus ref="skusRef" @reload-data="getData"></skus>
    </div>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import { getGoodsList, updateGoodsStatus, createGoods,
    deleteGoods, updateGoods, restoreGoods, destroyGoods} from '@/api/goods'
import { getCategoryList } from '@/api/category'
import ChooseImage from '@/components/ChooseImage.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
import ListHeader from '@/components/ListHeader.vue'
import Search from '@/components/Search.vue'
import SearchItem from '@/components/SearchItem.vue'
import banners from '@/page/goods/banners.vue'
import content from '@/page/goods/content.vue'
import skus from '@/page/goods/skus.vue'
import { toast } from '@/composables/util'

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
    multipleTableRef,
    handleSelectionChange,
    handleMultiDelete,
    handleMultiStatusChange,
    multiSelectionIds
} = useInitTable({
    searchForm: {
        title: '',
        tab: 'all',
        category_id: null,
    },
    getList: getGoodsList,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => {
            o.bannersLoading = false
            o.contentLoading = false
            o.skusLoading = false
            return o
        })

        total.value = res.totalCount
    },
    delete: deleteGoods,
    updateStatus: updateGoodsStatus
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
    update: updateGoods,
    create: createGoods,
    form: {
        title: null,	 		
	    category_id: null,
	    cover: null,
	    desc: null, 
	    unit:'件',
	    stock:100, //总库存
	    min_stock:10,// 库存预警
	    status:1, // 是否上架，0仓库1上架
	    stock_display:1,// 库存显示，0隐藏1显示
	    min_price: 0,
	    min_oprice: 0
    },
    rules: {
        username: [{
            required: true,
            trigger: blur,
            message: '管理员名称不能为空'
        }],
        password: [{
            required: true,
            trigger: blur,
            message: '密码不能为空'
        }]
    }
})

// 订单类型
const tabbars = [
    {
        key: 'all',
        name: '全部'
    },
    {
        key: 'checking',
        name: '审核中'
    },
    {
        key: 'saling',
        name: '出售中'
    },
    {
        key: 'off',
        name: '已下架'
    },
    {
        key: 'min_stock',
        name: '库存预警'
    },
    {
        key: 'delete',
        name: '回收站'
    }
]

// 商品分类
const category_list = ref([])
getCategoryList().then(res => {
    category_list.value = res
})

const bannersRef = ref(null)
const handleSetGoodsBanners = (row)=>{
    bannersRef.value.open(row)
}

const contentRef = ref(null)
const handleSetGoodsContent = (row)=>{
    contentRef.value.open(row)
}

const skusRef = ref(null)
const handleSetGoodsSkus = (row)=>{
    skusRef.value.open(row)
}

// 恢复商品
const handleRestoreGoods =()=> useMultiAction(restoreGoods,'恢复')

// 彻底删除商品
const handleDestroyGoods=()=>useMultiAction(destroyGoods,'彻底删除')

function useMultiAction(func,msg) {
    loading.value = true
    func(multiSelectionIds.value)
    .then(res=>{
        toast(msg+'成功')
        if(multipleTableRef.value){
            multipleTableRef.value.clearSelection()
        }
        getData()
    })
    .finally(()=>{
        loading.value = false
    })
}
</script>