<template>
    <div>
        <el-col :sm="12" :lg="6">
            <el-result
              icon="warning"
              title="404"
              sub-title="Please follow the instructions"
            >
            <template #extra>
              <el-button type="primary" @click="$router.push('/')">回到首页</el-button>
            </template>
        </el-result>
        </el-col>
    </div>
</template>

<script setup >


</script>
<style scoped>

</style>
