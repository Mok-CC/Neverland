<template>
    <el-row :gutter="20" class="mb-5">
        <template v-if="loading">
            <el-col :span="6" v-for="i in 4" :key="i">
                <el-skeleton style="width: 100%" animated loading>
                    <template #template>
                        <el-card shadow="hover">
                            <template #header>
                                <div class="flex justify-between">
                                    <el-skeleton-item variant="text" style="width: 50%" />
                                    <el-skeleton-item variant="text" style="width: 10%" />
                                </div>
                            </template>
                            <!-- card body -->
                            <el-skeleton-item variant="h3" style="width: 85%" />
                            
                        </el-card>
                    </template>
                </el-skeleton>
            </el-col>
        </template>

        <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
            <el-card shadow="never">
                <div class="flex items-center">

                    <el-icon class="text-white w-[40px] h-[40px] rounded-full " :class="item.color" :size="20">
                        <User v-if="index === 0" />
                        <ShoppingCart v-if="index === 1" />
                        <PriceTag v-if="index === 2" />
                        <Timer v-if="index === 3" />
                    </el-icon>

                    <div class="ml-2">
                        <h2 class="text-lg font-bold">{{ item.value }}</h2>
                        <small class="text-xs text-gray-500">{{ item.label }}</small>
                    </div>
                </div>
            </el-card>

        </el-col>

    </el-row>

</template>
<script setup>
import { getAgentStatistics } from '@/api/distribution'
import { ref } from 'vue'

const list = ref([])
const loading = ref(false)

loading.value = true
getAgentStatistics().then(res => {
    list.value = res.panels
}).finally(() => {
    loading.value = false
})
</script>