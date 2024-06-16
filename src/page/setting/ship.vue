<template>
    <div v-loading="loading" class="bg-white p-4 rounded">
        <el-form :model="form" label-width="160px">
            <el-tabs>
                <el-form-item label="物流查询key">
                    <div>
                        <el-input v-model="form.ship" placeholder="物流查询key">
                        </el-input>
                        <small class="text-gray-500 mt-1 flex">用于查询物流信息，接口申请（仅供参考）</small>
                    </div>
                </el-form-item>

                <el-form-item label="">
                    <el-button type="primary" size="default" @click="submit">保存</el-button>
                </el-form-item>
            </el-tabs>
        </el-form>

    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { getSysconfig, setSysconfig } from '@/api/sysconfig'

const form = reactive({
    "ship": ""
})

const loading = ref(false)
function getData() {

    loading.value = true
    getSysconfig().then(res => {
        for (const key in form) {
            form[key] = res[key]
        }
    }).finally(() => {
        loading.value = false
    })
}
getData()

const submit = () => {
    loading.value = true
    setSysconfig({
        ...form,
    }).then(res => {
        toast('修改成功')
        getData()
    }).finally(() => {
        loading.value = false
    })
}


</script>