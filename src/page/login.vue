<template>
    <el-row class="loginPage">
        <!-- 左边部分 -->
        <el-col :lg="16" :md="12" class="login_left">
            <div>
                <h1>梦幻岛的后花园</h1>
                <p class="text-gray-200">
                    集多功能模块的线上集市后台，
                    <span class="gradient-text">助力乡村发展</span>
                </p>
                 
                 <!--<el-carousel height="200px" motion-blur>
                <el-carousel-item v-for="item in 4" :key="item">
                    <h3 class="small justify-center" text="2xl">{{ item }}</h3>
                </el-carousel-item>
                </el-carousel>-->
            </div>
        </el-col>
        <!-- 右边登录 -->
        <el-col :lg="8" :md="12" class="login_right">
            <h2>欢迎回来</h2>
            <div class="">
                <span class="h-[1px] w-16 bg-gray-200"></span>
                <span>&nbsp;账号密码登录&nbsp;</span>
                <span class="h-[1px] w-16 bg-gray-200"></span>
            </div>

            <!-- 用户名和密码表单 -->
            <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <i-ep-user />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" show-password v-model="form.password" placeholder="请输入密码">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <i-ep-lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" round :loading="loading" class="btn" @click="onSubmit">登 录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>
<script setup>
import { ref, reactive,onMounted,onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { useStore } from 'vuex'
import { toast } from '@/composables/util'
// do not use same name with ref
const router = useRouter()
const store = useStore()

const loading = ref(false) // 登录按钮的加载状态
const form = reactive({
    username: '',
    password: ''
})

/* 验证规则 */
const rules = {
    username: [{
        required: true,
        message: '用户名不能为空',
        trigger: 'blur'
    }],
    password: [{
        required: true,
        message: '密码不能为空',
        trigger: 'blur'
    }]
}

// 响应式表单
const formRef = ref(null)
// 提交登录
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) { return false }
        loading.value = true

        store.dispatch('login', form).then(res => {
            toast('登录成功')
            router.push('/')
        }).finally(() => {
            loading.value = false
        })
    })
}

// 回车监听
function onKeyup(e){
    if(e.key === 'Enter')onSubmit()
}

// 添加键盘监听
onMounted(()=>{
    document.addEventListener('keyup',onKeyup)
})
// 移除键盘监听
onBeforeUnmount(()=>{
    document.removeEventListener('keyup',onKeyup)
})
</script>

<style scoped>
.loginPage {
    @apply min-h-screen
}

.login_left {
    @apply bg-gradient-to-r from-green-500 to-blue-500 flex flex-col justify-center items-center
}

.login_left h1 {
    @apply text-light-50 text-5xl mb-4 font-bold
}

.login_right {
    @apply bg-light-50 flex flex-col justify-center items-center
}

.login_right>h2 {
    @apply font-bold text-3xl text-gray-800
}

.login_right>div {
    @apply flex items-center justify-center my-5 text-gray-300 space-x-2
}

.btn {
    @apply w-[250px] bg-gradient-to-r to-green-500 from-blue-500
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
/* 字体渐变 */
.gradient-text {
  background-image: linear-gradient(to right, red, blue);
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
