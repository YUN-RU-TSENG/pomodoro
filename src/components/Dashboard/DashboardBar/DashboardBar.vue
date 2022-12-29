<script setup>
import dayjs from 'dayjs'
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import '@/utils/initialChartSetting'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

const props = defineProps({
    tasksData: { type: Array, require: true },
})

const tasksQuantityOfWeek = computed(() => {
    // 返回星期一到星期日陣列（每天任務完成數量）
    const result = Array.from({ length: 7 }, () => 0)

    // 迴圈任務，並且將值添加到空陣列
    for (let i = 0; i < props.tasksData.length; i++) {
        if (!props.tasksData[i].finishAt) continue

        const taskDate = dayjs(props.tasksData[i].finishAt)
        const isInWeek = taskDate.isBetween(dayjs().day(0), dayjs().day(6))

        if (!isInWeek) continue
        const dayOfWeek = taskDate.day()

        result[dayOfWeek] += 1
    }
    return result
})

const data = ref({
    labels: [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
    ],
    datasets: [
        {
            data: tasksQuantityOfWeek,
            label: '任務',
            backgroundColor: '#f87979',
        },
    ],
})

const options = ref({
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: '一週完成任務數量',
            color: '#5d5d5d',
            font: {
                size: 18,
                weight: 'bold',
            },
        },
        subtitle: {
            display: true,
            text: '看看完成了哪些預期項目吧！',
            color: '#7c7c7c',
            font: {
                size: 14,
                weight: 'normal',
            },
        },
    },
})
</script>

<template>
    <Bar :data="data" :options="options" />
</template>

<style scoped lang="scss"></style>
