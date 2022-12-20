<script setup>
import { onBeforeMount } from 'vue'
import { useTasksStore } from '@/stores/tasks'

/* ========== pinia ========== */
const tasksStore = useTasksStore()

onBeforeMount(async () => {
    // getTask
    tasksStore.getTasks()
})
</script>

<template>
    <BaseLoading v-if="tasksStore.isLoadingTaskGet" text="加載用戶配置" />
    <div v-else class="dashboard">
        <HomeTimeSum
            class="home-time-sum"
            :the-sum-of-expect-time-of-task="
                tasksStore.theSumOfExpectTimeOfTask
            "
            :the-sum-of-spend-time-of-task="tasksStore.theSumOfSpendTimeOfTask"
            :the-sum-of-number-of-un-finish-tasks="
                tasksStore.theSumOfNumberOfUnFinishTasks
            "
            :the-sum-of-number-of-finish-tasks="
                tasksStore.theSumOfNumberOfFinishTasks
            "
        />
        <DashboardBar
            class="dashboard-chart"
            :tasks-data="tasksStore.tasks"
        ></DashboardBar>
        <DashboardLine
            class="dashboard-chart"
            :tasks-data="tasksStore.tasks"
        ></DashboardLine>
    </div>
</template>

<style lang="scss" scoped>
.dashboard {
    width: 750px;
    margin: 0 auto;
    padding-top: 24px;
}

.dashboard-chart {
    margin-bottom: 24px;
}

.dashboard-sum {
    margin-bottom: 24px;
}
</style>
