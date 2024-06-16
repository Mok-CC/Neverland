<template>
    <el-container>
        <el-header>
            <f-header></f-header>
        </el-header>
        <el-container>
            <el-aside :width="$store.state.asidewidth">
                <f-menu></f-menu>
            </el-aside>
            <el-main>
                <f-tag-list></f-tag-list>
                <router-view v-slot="{ Component }">
                    <!-- transition 实现部分只能有一个根标签 -->
                    <transition name="fade">
                        <keep-alive :max="10">
                            <component :is="Component"></component>
                        </keep-alive>
                    </transition>
                </router-view>

            </el-main>

        </el-container>
        
    </el-container>
</template>

<script setup>
import FHeader from '@/layouts/components/FHeader.vue'
import FMenu from '@/layouts/components/FMenu.vue'
import FTagList from '@/layouts/components/FTagList.vue'

</script>

<style>
.el-aside {
    transition: all 0.2s;
}

.fade-enter-from,
.fade-leave-to{
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
}
.fade-enter-to,
.fade-leave-from{
    opacity: 1;
}
.fade-enter-active,
.fade-leave-active{
    transition: all 0.3s ease;
}
.fade-enter-active{
    transition-delay: 0.3s;
}
</style>