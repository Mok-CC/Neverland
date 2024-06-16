<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-1">
                <MoonNight />
            </el-icon>
            梦幻岛 Fantasy Island
        </span>
        <!-- 侧边栏展开收起 -->
        <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
            <Fold v-if="$store.state.asidewidth == '250px'" />
            <Expand v-else />
        </el-icon>
        <!-- 刷新 -->
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="icon-btn" @click="handleRefresh">
                <Refresh />
            </el-icon>
        </el-tooltip>


        <div class="ml-auto flex items-center">
            <!-- 全屏 -->
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <el-icon class="icon-btn" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <aim v-else />
                </el-icon>
            </el-tooltip>

            <!-- 下拉菜单 -->
            <el-dropdown class="dropdown" @command="handleCommand" trigger="click">
                <span class="flex items-center text-light-50 ">
                    <el-avatar class="mr-1" :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="repassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <!-- 修改密码 -->
    <FormDrawer ref="formDrawerRef" title="修改密码" @submit="onSubmit">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" size="small">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input type="password" show-password v-model="form.oldpassword" placeholder="请输入旧密码">
                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="新密码">
                <el-input type="password" show-password v-model="form.password" placeholder="请输入新密码">
                </el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" show-password v-model="form.repassword" placeholder="请输入新密码">
                </el-input>
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>
<script setup>

import FormDrawer from '@/components/FormDrawer.vue'
import { useFullscreen } from '@vueuse/core'
import { useRepassword, useLogout } from "@/composables/useManaage"

const { isFullscreen, toggle } = useFullscreen()
//修改密码
const {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRePasswordForm
} = useRepassword()

// 退出登录
const {
    handlelogout
} = useLogout()

// 刷新
const handleRefresh = () => {
    location.reload()
}
// 下拉菜单的选项
function handleCommand(c) {
    switch (c) {
        case 'logout':
            handlelogout()
            break;
        case 'repassword':
            // showDrawer.value = true
            openRePasswordForm()
            break;
    }
}

</script>
<style scoped>
.f-header {
    @apply flex items-center bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-light-50 fixed top-0 left-0 right-0;
    height: 64px;
    z-index: 100;
}

.logo {
    width: 350px;
    @apply flex justify-center items-center text-xl
}

.icon-btn {
    @apply flex justify-center items-center;
    height: 64px;
    width: 42px;
    cursor: pointer;
}

.f-header .dropdown {
    height: 64px;
    cursor: pointer;
    @apply flex justify-center items-center mx-5
}
</style>
