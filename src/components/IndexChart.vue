<template>
    <el-card shadow="never">
        <template #header>
            <div class="flex justify-between">
                <span class="text-sm ">订单统计</span>
                <div>
                    <el-check-tag :checked="current == item.value" v-for="(item, index) in options" :key="index"
                        style="margin-right: 8px;" @click="handleChoose(item.value)">
                        {{ item.text }}
                    </el-check-tag>
                </div>
            </div>
        </template>
        <!-- card body -->
        <div ref="el" id="chart" style="width: 100%; height: 300px;">
        </div>
    </el-card>

</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts';
import { getStatistics3 } from '@/api/index.js';
import { useResizeObserver } from '@vueuse/core' // echart图表随窗口收缩

const current = ref('week')
const options = [{
    text: "近1个月",
    value: "month"
}, {
    text: "近1周",
    value: "week"
}, {
    text: "近24小时",
    value: "hour"
}]

// 切换年月周的数据
const handleChoose = (type) => {
    current.value = type
    getData()
}

// 挂载后才能绘图
var myChart = null
onMounted(() => {
    var chartDom = document.getElementById('chart')
    if(chartDom){
        myChart = echarts.init(chartDom)
        getData()
    }
    
})
// 获取数据来绘制ECharts
function getData(){
    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar',
                // 设置单个柱子的样式
                itemStyle: {
                    color: '#87CEFA',
                    opacity: 0.9
                }

            }
        ]
    }

    myChart.showLoading()
    getStatistics3(current.value)
    .then(res=>{
        //console.log(res)
        option.xAxis.data = res.x
        option.series[0].data = res.y
        myChart.setOption(option)
    })
    .finally(()=>{
        myChart.hideLoading()
    })
    
}

// el绑定echart图表，resize获取浏览器大小改变，width为100%
const el = ref(null)
useResizeObserver(el, (entries) => {
    myChart.resize()
    })

// 图表容器销毁前，把图表销毁掉，避免回到此页面出现白屏（图表所在节点被移除）
onBeforeUnmount(()=>{
    if(myChart){
        echarts.dispose()
    }
})
</script>