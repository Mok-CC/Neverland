<!-- 骨架屏里面数据从0增长的一个动画效果 -->
<template>
    {{ d.num.toFixed(0) }}
</template>
<script setup>
import gsap from 'gsap'
import { reactive,watch } from 'vue'

const props = defineProps({
    value:{
        type:Number,
        default:0
    }
})

const d = reactive({
    num: 0
})

function AnimateToValue() {
    gsap.to(d,{
        duration: 0.5,
        num: props.value
    })
}

AnimateToValue()

watch(()=>props.value,()=>AnimateToValue())
</script>