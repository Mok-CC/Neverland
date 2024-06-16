<template>
    <el-upload
      class="upload-demo"
      drag
      :action="uploadImageAction"
      multiple
      :headers="{
        token
      }"
      name="img"
      :data="data"
      :on-success="uploadSuccess"
      :on-error="uploadError"
    >
      <el-icon class="el-icon--upload"><i-ep-upload-filled /></el-icon>
      <div class="el-upload__text">
        拖拽文件 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
      <!--  jpg/png files with a size less than 500kb -->
        小于 500KB 的 jpg/png 文件
        </div>
      </template>
    </el-upload>
  </template>
<script setup>
import { uploadImageAction } from '@/api/image.js'
import { getToken } from '@/composables/auth.js'
import { toast } from '@/composables/util.js'

const token = getToken()

const emit = defineEmits(['success'])
const uploadSuccess = (response, uploadFile, uploadFiles) =>{
    // console.log(response)    
    emit('success',{
        response, uploadFile, uploadFiles
    })
}
const uploadError = (error, uploadFile, uploadFiles) =>{
    let msg = JSON.parse(error.message).msg || '上传失败'
    toast(msg)
}

defineProps({
    data:Object
})
</script>