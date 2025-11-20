<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import VueECharts from 'vue-echarts';
import 'echarts';
//@ts-ignore
// import { useStore } from 'vuex'
import { useLayoutStore } from '@/stores/layout'
// const store = useStore();
const layoutStore = useLayoutStore()

defineProps({
    options: Object,
    height: {
        type: Number,
        default: 300
    },
})

</script>
<template>
    <VueECharts  :option="options" autoresize :style="`height: ${height}px`" />
</template>
