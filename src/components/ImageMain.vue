<template>
    <el-main class="image-main" v-loading="loading">
            <div class="top p-3">  
                <el-row :gutter="10">
                    <el-col :span="6" :offset="0"  v-for="(item,index) in list" :key="index">
                        <el-card shadow="hover" class="relative mb-3" :body-style="{padding:0}" :class="{'border-blue-500':item.checked}">
                            <el-image :src="item.url" fit="cover" :lazy="true" 
                                class="w-full h-[150px]"  :preview-src-list="[item.url]"
                                :initial-index="0">
                            </el-image>
                            <div class="image-title">{{ item.name }}</div>
                            <div class="flex items-center justify-center p-2">

                                <el-checkbox v-if="openChoose" v-model="item.checked" @change="handleChooseChange(item)"/>
                                
                                <el-button type="primary" size="small" text @click="handleEdit(item)">重命名</el-button>

                                <el-popconfirm title="是否确认删除该图片？" confirm-button-text="确认" 
                                cancel-button-text="取消" @confirm="handleDelete(item.id)">
                                    <template #reference>
                                        <el-button type="primary" size="small" text>删除</el-button>
                                    </template>
                                </el-popconfirm>
                                
                            </div>
                        </el-card>
                        
                    </el-col>
                </el-row>
                
            </div>
            <div class="bottom">
                <!-- 分页部分 -->
                <el-pagination background layout="prev, pager, next" :total="total" 
                :current-page="currentPage" :page-size="limit" @current-change="getData" />
            </div>
        </el-main>

        <el-drawer
    v-model="drawer"
    title="上传图片"
  >
    <UploadFile :data="{ image_class_id }" @success="handleUploadSuccess"/>
  </el-drawer>
</template>
<script setup>
import { computed, ref } from 'vue'
import { getImageList, updateImage, deleteImage } from '@/api/image.js'
import { showPrompt, toast } from '@/composables/util.js'
import UploadFile from '@/components/UploadFile.vue'

// 上传图片
const drawer = ref(false)
const openUploadFile = () =>drawer.value = true


// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
const list =ref([])
const loading = ref(false)
const image_class_id = ref(0)
// 获取数据
function getData(p = null) {
    // 获取当前页码再去获取数据
    if(typeof(p) === 'number'){
        currentPage.value = p
    }
    // 加载效果
    loading.value = true
    getImageList(image_class_id.value,currentPage.value)
    .then(res => {
        total.value = res.totalCount
        // checked框的值
        list.value = res.list.map(o => {
            o.checked = false
            return o
        })
    })
    .finally(()=>{
        loading.value = false
    })
}
//getData()

// 根据分类id重新加载图片列表
const loadData = (id) =>{
    currentPage.value = 1
    image_class_id.value = id
    getData()
}

// 重命名
const handleEdit = (item)=>{
    showPrompt('重命名',item.name)
    .then(({ value }) => {
        loading.value = true
        updateImage(item.id,value)
        .then(res=>{
            toast('修改成功')
            getData()
        })
    })
    .finally(() => {
        loading.value = false
    })
}

// 删除图片
const handleDelete= (id) =>{
    loading.value = true
    deleteImage([id])
    .then(res=>{
        toast('删除成功')
        getData()
    })
    .finally(()=>{
        loading.value = false
    })
}
// 上传成功刷新数据
const handleUploadSuccess = ()=>{
    toast('上传成功')
    getData(1)
}

const props = defineProps({
    openChoose:{
        type:Boolean,
        default:false
    },
    limit:{
        type:Number,
        default:1
    }
})
// 选中的图片
const emit = defineEmits(['choose'])
const checkedImage = computed(()=> list.value.filter(o => o.checked))
const handleChooseChange = (item) =>{
    if(item.checked && checkedImage.value.length > props.limit){
        item.checked = false
        return toast(`最多只能选择${props.limit}张图片`,'error')
    }
    emit('choose',checkedImage.value)
}

defineExpose({
    loadData,
    openUploadFile
})
</script>
<style scoped>
.image-main{
  position: relative;
}
.image-main .top{
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 50px;
    overflow-y: auto;
}
.image-main .bottom{
    bottom: 0;
    position: absolute;
    height: 50px;
    right: 0;
    left: 0;
    @apply flex items-center justify-center;
}
.image-title{
    position: absolute;
    top: 122px;
    left: -1px;
    right: -1px;
    @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1
    
}
</style>