<template>
    <el-form-item label="规格选项" v-loading="bodyLoading">
        <el-card shadow="never" class="w-full mb-3" 
        v-for="(item,index) in sku_card_list" :key=item.id
        v-loading="item.loading">
            <template #header>
            <div class="flex items-center">
                <el-input  v-model="item.text" placeholder="规格名称"
                @change="handleUpdate(item)" style="width: 200px;">
                    <template #append>
                        <el-icon @click="handleChooseSku(item)" class="cursor-pointer"><More /></el-icon>
                    </template>
                </el-input>
                <el-button class="ml-auto" size="small" @click="sortCard('up',index)" :disabled="index === 0"><el-icon><Top/></el-icon></el-button>
                <el-button size="small" @click="sortCard('down',index)" :disabled="index === sku_card_list.length-1"><el-icon><Bottom /></el-icon></el-button>
                <el-popconfirm title="是否确认删除该规格选项？" confirm-button-text="确认" cancel-button-text="取消"
                @confirm="handleDelete(item)">
                    <template #reference>
                        <el-button size="small"><el-icon><Delete /></el-icon></el-button>
                    </template>
                </el-popconfirm>
                
            </div>
            </template>
            <!-- card body -->
            <SkuCardItem :skuCardId="item.id"></SkuCardItem>
        </el-card>
        <el-button type="success" size="default" :loading="btnLoading"
        @click="addSkuCardEvent">添加规格选项</el-button>
        
    </el-form-item>

    <ChooseSku ref="ChooseSkuRef"></ChooseSku>
</template>
<script setup>
import SkuCardItem from './SkuCardItem.vue'
import { 
sku_card_list, addSkuCardEvent,
btnLoading, handleUpdate, handleDelete,
sortCard,bodyLoading,handleChooseSetGoodsSkusCard
} from '@/composables/useSku.js'
import ChooseSku from '@/components/ChooseSku.vue'

const ChooseSkuRef = ref(null)
const handleChooseSku =(item)=>{
    ChooseSkuRef.value.open((value)=>{
        handleChooseSetGoodsSkusCard(item.id,{
            name:value.name,
            value:value.list
        })
    })
}
</script>
<style>
.el-card__header{
    @apply !p-2 bg-gray-50
}
</style>