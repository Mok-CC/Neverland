<!-- 新增按钮和刷新 -->
<template>
    <div class="flex items-center justify-between mb-4">
        <div>
            <el-button v-if="btns.includes('create')" type="primary" size="small" @click="$emit('create')">新增</el-button>
            <el-popconfirm v-if="btns.includes('delete')" title="是否确认删除选中记录？" confirm-button-text="确认" 
                    cancel-button-text="取消" @confirm="$emit('delete')">
                        <template #reference>
                            <el-button  type="danger" size="small" @click="">批量删除</el-button>
                        </template>
            </el-popconfirm>
            <slot></slot>
        </div>
        
        <div>
            <el-tooltip v-if="btns.includes('refresh')" class="box-item" effect="dark" content="刷新数据" placement="top-start">
                <el-button size="small" text @click="$emit('refresh')">
                    <el-icon size="15">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip v-if="btns.includes('download')" class="box-item" effect="dark" content="导出数据" placement="top-start">
                <el-button size="small" text @click="$emit('download')">
                    <el-icon size="15">
                        <Download />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
        
    </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
    layout:{
        type:String,
        default:'create,refresh'
    }
})
const btns = computed(()=>props.layout.split(','))

defineEmits(['create','refresh','delete','download'])

</script>
