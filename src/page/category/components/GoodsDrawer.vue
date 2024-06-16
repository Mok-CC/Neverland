<template>
    <FormDrawer ref="formDrawerRef" title="推荐商品" 
    @submit="handleConnect" confirmText="关联">
        <el-table :data="tableData" border stripe style="width: 100%;">
            <el-table-column width="50" prop="goods_id" label="ID" />
            <el-table-column width="180" label="商品封面" >
                <template #default="{row}">
                    <el-image :src="row.cover" style="width: 64px; height: 64px;" 
                    fit="fill" :lazy="true"></el-image>
                    
                </template>
            </el-table-column>
            <el-table-column width="180" prop="name" label="商品名称" />
            <el-table-column label="操作" >
                <template  #default="{ row }">
                    <el-popconfirm title="是否确认删除记录" confirm-button-text="确认" 
                        cancel-button-text="取消" @confirm="handleDelete(row)">
                        <template #reference>
                            <el-button type="primary" size="small" text :loading="row.loading">删除</el-button>
                        </template>
                    </el-popconfirm>
                    
                </template>
            </el-table-column>
            
        </el-table>
        
    </FormDrawer>

    <ChooseGoods ref="ChooseGoodsRef"/>
</template>
<script setup>
import FormDrawer from '@/components/FormDrawer.vue'
import { ref } from 'vue'
import { getCategoryGoods, deleteCategoryGoods, connectCategoryGoods } from '@/api/category.js'
import { toast } from '@/composables/util.js'
import ChooseGoods from '@/components/ChooseGoods.vue'

const formDrawerRef = ref(null)
const category_id = ref(0)
const tableData = ref([])

const open=(item)=>{
    category_id.value = item.id
    item.goodsDrawerLoading = true
    getData()
    .then(res=>{
        formDrawerRef.value.open()
    })
    .finally(()=>{
        item.goodsDrawerLoading = false
    })
    
}

function getData() {
    return getCategoryGoods(category_id.value)
    .then(res=>{
        tableData.value = res.map(o=>{
            o.loading = false
            return o
        })
    })
}

const handleDelete =(row)=>{
    row.loading = true
    deleteCategoryGoods(row.id)
    .then(res=>{
        toast('删除成功')
        getData()
    })
}


const ChooseGoodsRef = ref(null)
const handleConnect =()=>{
    ChooseGoodsRef.value.open((goods_ids)=>{
        formDrawerRef.value.showLoading()
        connectCategoryGoods({
            category_id :category_id.value,
            goods_ids
        }).then(res=>{
            getData()
            toast('关联成功')
        })
        .finally(()=>{
            formDrawerRef.value.hideLoading()
        })
    })
}

defineExpose({
    open
})
</script>