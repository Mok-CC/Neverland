<template>
    <div v-if="modelValue && preview">
        <el-image v-if="typeof modelValue == 'string'" :src="modelValue" fit="cover" 
        class="w-[100px] h-[100px] rounded border mr-2 mt-2"/>
        <div v-else class="flex flex-wrap">
            <div class="relative mx-1 mb-2 w-[100px] h-[100px]" v-for="(url,index) in modelValue" :key="index">
                <el-icon class="absolute right-[5px] top-[10px] cursor-pointer z-10 rounded-full bg-white"
                @click="removeImage(url)">
                    <CircleClose />
                </el-icon>
                <el-image :src="url" fit="cover"
                class="w-[100px] h-[100px] rounded border mr-2 mt-2">
                </el-image>
            </div>
        </div>
    </div>
    <div v-if="preview" class="choose-image-btn" @click="openImage">
        <el-icon :size="35" class="text-gray-500"><i-ep-Plus/></el-icon>
    </div>

    <el-dialog
        title="选择图片"
        v-model="dialogVisible"
        width="80%"
        top="5vh"
        > 
        <!-- 弹出图片模块 -->
        <el-container class="bg-white rounded" style="height:70vh">
        <el-header class="image-header">
            <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
            <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
        </el-header>
        <el-container>
            
            <ImageAside ref="ImageAsideRef" @change="handleAsideChange"/>
            <ImageMain :limit="limit" openChoose ref="ImageMainRef" @choose="handleChoose"/>
            
        </el-container>
        </el-container>
        
        <span></span>
        <template #footer>
        <span>
            <el-button @click="closeImage">取消</el-button>
            <el-button type="primary" @click="submit">确认</el-button>
        </span>
        </template>
    </el-dialog>
        

</template>
<script setup>
import { ref } from 'vue'
import ImageAside from '@/components/ImageAside.vue'
import ImageMain from '@/components/ImageMain.vue'
import { toast } from '@/composables/util'

const dialogVisible = ref(false)

const callbackFunction  = ref(null)
// 打开头像的选择图片模块
const openImage = (callback = null) =>{
    callbackFunction.value= callback
    dialogVisible.value = true
}
const closeImage = () => dialogVisible.value = false

const ImageAsideRef = ref(null)
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const ImageMainRef =ref(null)
const handleAsideChange = (image_class_id) => {
  ImageMainRef.value.loadData(image_class_id)
}

const handleOpenUpload = ()=>{
  ImageMainRef.value.openUploadFile()
}


const props = defineProps({
    modelValue:[String,Array],
    limit:{
        type:Number,
        default:1
    },
    preview:{
        type:Boolean,
        default:true
    }
})
const emit = defineEmits(["update:modelValue"])

let urls = []
const handleChoose = (e) =>{
    urls = e.map(o =>o.url)
}
// 提交选中图片
const submit = () =>{
    let value = []
    if(props.limit === 1){
        value = urls[0]
    }else{
        value = props.preview ? [...props.modelValue,...urls] : [...urls]/* 合并之前的和现在选中的轮播图片 */
        if(value.length > props.limit){
            let limit = props.preview ? (props.limit-props.modelValue.length) :props.limit
            return toast(`最多还能选择${limit}张`)
        }
    }
    if(value && props.preview){
        emit('update:modelValue',value)
    }
    if(!props.preview &&typeof callbackFunction.value === 'function'){
        callbackFunction.value(value)
    }
    
    closeImage()
    //console.log(`url:${urls}`)
}

const removeImage = (url)=> emit('update:modelValue', props.modelValue.filter(u=> u !== url ))

defineExpose({
    openImage
})
</script>
<style scoped>
.choose-image-btn{
    @apply w-[100px] h-[100px] flex items-center justify-center rounded border 
    cursor-pointer hover:(bg-gray-100)
}
.image-header{
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center
}
</style>