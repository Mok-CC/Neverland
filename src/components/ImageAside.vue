<template>
    <el-aside width="220px" class="image-aside" v-loading="loading">
        <div class="top">

            <AsideList v-for="(item,index) in list" 
            :key="index" :active="activeId === item.id"
            @edit="handleEdit(item)" @delete="handleDelete(item.id)"
            @click="handleChangeActiveId(item.id)">
                {{ item.name }}
            </AsideList>

        </div>
        <div class="bottom">
            <el-pagination background layout="prev, next" :total="total" 
            :current-page="currentPage" :page-size="limit" @current-change="getData" />
        </div>
    </el-aside>

    <FormDrawer ref="formDrawerRef" @submit="handleSubmit" :title="drawerTitle">
        <el-form :model="form" ref="formRef" 
        :rules="rules" label-width="80px" :inline="false">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
            </el-form-item>
        </el-form>
        
    </FormDrawer>

</template>
<script setup>
import { computed, reactive, ref } from 'vue'
import AsideList from './AsideList.vue'
import{ getImageClassList, createImageClass,
        updateImageClass, deleteImageClass 
} from '@/api/image_class.js'
import FormDrawer from '@/components/FormDrawer.vue'
import { toast } from "@/composables/util.js"

const loading = ref(false)

// 图库主题列表
const list = ref([])


// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

// 获取数据
function getData(p = null) {
    // 获取当前页码再去获取数据
    if(typeof(p) === 'number'){
        currentPage.value = p
    }
    // 加载效果
    loading.value = true
    getImageClassList(currentPage.value)
    .then(res => {
        total.value = res.totalCount
        list.value = res.list
        let item = list.value[0]
        if(item){
            handleChangeActiveId(item.id)
        }
    })
    .finally(()=>{
        loading.value = false
    })
}
getData()

const formDrawerRef = ref(null)
const editId = ref(0) // 编辑图库的id
const drawerTitle = computed(()=>editId.value ? '修改' : '新增')

const form = reactive({
    name: '',
    order: 50
})

const rules = {
    name:[{
        required: true,
        message: '图库名称不能为空',
        trigger: 'blur'
    }]
}
const formRef = ref(null)
const handleSubmit = () => {
    //console.log('提交表单')
    formRef.value.validate((valid) => {
        if(!valid)return

        formDrawerRef.value.showLoading()

        const fun = editId.value ? updateImageClass(editId.value,form) :
        createImageClass(form)
        fun.then(res=>{
            toast(drawerTitle.value+'成功')
            getData(editId.value ? currentPage.value : 1)
            formDrawerRef.value.close()
        })
        .finally(()=>{
            formDrawerRef.value.hideLoading()
        })
    })
}

// 新增图库
const handleCreate = () => {
    editId.value = 0
    form.name =''
    form.order=50
    formDrawerRef.value.open()
}
// 编辑
const handleEdit = (row) =>{
    editId.value = row.id
    form.name = row.name
    form.order = row.order
    formDrawerRef.value.open()
}
// 删除图库
const handleDelete = (id) =>{
    loading.value = true
    deleteImageClass(id)
    .then(res=>{
        toast('删除成功')
        getData()
    })
    .finally(()=>{
        loading.value = false
    })
}

// 选中图库的id
const activeId = ref(0)
// 通知父组件id改变了
const emit =  defineEmits(['change'])
// 切换选中的分类
function handleChangeActiveId(id){
    activeId.value = id
    emit('change',id)
}

// 暴露出去
defineExpose({
    handleCreate
})
</script>
<style scoped>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;

}
.image-aside .top{
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 50px;
    overflow-y: auto;
}
.image-aside .bottom{
    bottom: 0;
    position: absolute;
    height: 50px;
    right: 0;
    left: 0;
    @apply flex items-center justify-center;
}

</style>