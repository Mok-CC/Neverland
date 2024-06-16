<template>
  <div class="f-menu" :style="{width: $store.state.asidewidth}">
    <el-menu unique-opened :default-active="defaultActive" :collapse-transition="false" :collapse="isCollapse" default-active="2" class="border-0" @select="handleSelect">

      <template v-for="(item, index) in asideMenus" :key="index">
        <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
          <template #title>
            <el-icon>
              <component :is='item.icon'></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.frontpath">
            <el-icon>
              <component :is="item2.icon"></component>
            </el-icon>
            <span>{{ item2.name }}</span>
          </el-menu-item>

        </el-sub-menu>


        <el-menu-item :index="item.frontpath" v-else>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script setup>
import { ref, computed } from "vue"
import {useRouter, useRoute,onBeforeRouteUpdate} from 'vue-router'
import { useStore } from "vuex";

const route = useRoute()
const store = useStore()
const router = useRouter()
// 是否折叠
const isCollapse = computed(()=> !(store.state.asidewidth == '250px'))
// 页面加载时默认激活菜单的 index
const defaultActive = ref(route.path)
// 监听路由变化，侧边栏和菜单导航显示一样
onBeforeRouteUpdate((to,from)=>{
  defaultActive.value = to.path
})

const asideMenus = computed(()=>(store.state.menus))

// 菜单跳转
const handleSelect = (e) =>{
  router.push(e)
  //console.log(e)
}


</script>

<style scoped>
.f-menu {
  transition: all 0.2s;
  top: 64px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  @apply shadow-md fixed bg-light-50
}
.f-menu::-webkit-scrollbar{
  width: 0;
}
</style>
