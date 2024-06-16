<template>
    <el-drawer v-model="showDrawer" :title='title' :size='size' :destroy-on-close='destroyOnClose' :close-on-click-modal="false">
        <div class="formDrawer">
            <div class="body">
                <slot></slot>
            </div>
            <div class="actions">
                <el-button type="primary" @click="submit" :loading="loading">{{ confirmText }}</el-button>
                <el-button type="default" @click="close">取 消</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>
    import { ref } from 'vue'

    const loading = ref(false) // 登录按钮的加载状态
    const showDrawer = ref(false)

    const prop = defineProps({
        title:String,
        size:{
            type:String,
            default:'45%'
        },
        destroyOnClose:{
            type:Boolean,
            default:false
        },
        confirmText:{
            type:String,
            default:'提交'
        }
    })
    const emit = defineEmits(['submit'])
    const submit = () => emit('submit')

    const open=() => showDrawer.value = true
    const close=() => showDrawer.value = false
    const showLoading =() => loading.value = true
    const hideLoading =() => loading.value = false

    // 暴露出去
    defineExpose({
        open,
        close,
        showLoading,
        hideLoading
    })
</script>

<style scoped>
.formDrawer{
    height: 100%;
    widows: 100%;
    @apply  flex flex-col 
}

.formDrawer .body{
    @apply flex-1  mb-3 overflow-y-auto
}

</style>