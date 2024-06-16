<template>
    <div class="aside-list" :class="{ 'active': active }">
        <span class="truncate"><slot></slot></span>
        <el-button text size="small" type="primary" class="ml-auto px-1" @click.stop="$emit('edit')"><!-- 阻止冒泡事件 -->
            <el-icon :size="12"><i-ep-Edit /></el-icon>
        </el-button>

        <span @click.stop="()=>{}"> <!-- 阻止冒泡 -->
            <el-popconfirm title="是否确认删除该分类？" confirm-button-text="确认" cancel-button-text="取消" @confirm="$emit('delete')">
                <template #reference>
                    <el-button text size="small" type="primary" class="px-1">
                        <el-icon :size="12"><i-ep-close /></el-icon>
                    </el-button>
                </template>
            </el-popconfirm>
        </span>
        
    </div>
</template>
<script setup>
    defineProps({
        active:{
            type: Boolean,
            default:false 
        }
    })
    defineEmits(['edit','delete'])
</script>
<style scoped>
.aside-list {
    @apply flex items-center text-sm p-3 text-gray-500;
    cursor: pointer;
    border-bottom: 1px solid #f4f4f4;
}

.aside-list:hover,
.active {
    @apply bg-blue-100;
}
</style>