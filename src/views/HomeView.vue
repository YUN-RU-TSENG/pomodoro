<script setup>
// import { useUserStore } from '@/stores/user'
import { useTasksStore } from '@/stores/tasks'
import { usePomodoroClockStore } from '@/stores/pomodoroClock'
import { useFolderTypesStore } from '@/stores/folderTypes'
import { usePomodoroSetting } from '@/stores/pomodoroSetting'
import { useFilterTasksStore } from '@/stores/filterTasks'
import { onBeforeMount } from 'vue'

/* ========== pinia ========== */
const filterTasksStore = useFilterTasksStore()
const tasksStore = useTasksStore()
const pomodoroClockStore = usePomodoroClockStore()
const folderTypesStore = useFolderTypesStore()
const pomodoroSettingStore = usePomodoroSetting()

/* ========== component logic ========== */

onBeforeMount(async () => {
    // getTask
    tasksStore.getTasks()
    // folder
    folderTypesStore.getFolderTypes()
})

const { handleAddTask } = useHandleAddTask({
    tasksStore,
})

/*========== component scoped composables function ========== */

// addTask
function useHandleAddTask({ tasksStore }) {
    const handleAddTask = async ({ formValue, resetForm }) => {
        await tasksStore.addTask(formValue)
        // 判斷當添加成功，重置表單
        if (!tasksStore.errorOfTaskAdd) resetForm()
    }

    return {
        handleAddTask,
    }
}
</script>

<template>
    <section class="home">
        <!-- home home-workspace -->
        <main class="home-workspace">
            <!-- workspace-sidebar -->
            <HomeSidebar
                v-model:selected-filter-option="
                    filterTasksStore.selectedFilterOption
                "
                :filter-task-folder-options-format-for-sidebar="
                    filterTasksStore.filterTaskFolderOptionsFormatForSidebar
                "
                :filter-task-options-format-for-sidebar="
                    filterTasksStore.filterTaskOptionsFormatForSidebar
                "
                class="workspace-sidebar"
                :is-loading-folder-types-add="
                    folderTypesStore.isLoadingFolderTypesAdd
                "
                @add-folder-type="folderTypesStore.addFolderType($event)"
            />
            <!-- workspace-current-task -->
            <section class="workspace-current-task">
                <div class="task-list">
                    <div class="list-title">
                        <h2>
                            {{ filterTasksStore.selectedFilterOption.name }}
                        </h2>
                        <button class="sort">
                            <img src="@/assets/images/sort.png" width="20" />
                        </button>
                    </div>
                    <HomeTimeSum
                        class="home-time-sum"
                        :the-sum-of-expect-time-of-task="
                            tasksStore.theSumOfExpectTimeOfTask
                        "
                        :the-sum-of-spend-time-of-task="
                            tasksStore.theSumOfSpendTimeOfTask
                        "
                        :the-sum-of-number-of-un-finish-tasks="
                            tasksStore.theSumOfNumberOfUnFinishTasks
                        "
                        :the-sum-of-number-of-finish-tasks="
                            tasksStore.theSumOfNumberOfFinishTasks
                        "
                    />
                    <HomeAddTask
                        :folder-types="folderTypesStore.folderTypes"
                        :pomodoro-settings="
                            pomodoroSettingStore.pomodoroSettings
                        "
                        @add-tasks="handleAddTask"
                    />
                    <HomeList
                        class="home-list"
                        :is-loading="tasksStore.isLoadingTaskGet"
                        title="Tasks"
                    >
                        <HomeListItem
                            v-for="task of filterTasksStore.filterTasks"
                            :key="task.id"
                            v-model:cache-update-task-id="
                                tasksStore.selectedUpdateTaskId
                            "
                            v-model:pomodoro-selected-task-id="
                                pomodoroClockStore.selectedTaskId
                            "
                            :task="task"
                            :pomodoro-settings="
                                pomodoroSettingStore.pomodoroSettings
                            "
                        />
                    </HomeList>
                </div>
                <div v-if="tasksStore.selectedUpdateTaskId" class="task-detail">
                    <HomeTaskEditBar
                        v-model:selected-task-id="
                            tasksStore.selectedUpdateTaskId
                        "
                        v-model:pomodoro-selected-task-id="
                            pomodoroClockStore.selectedTaskId
                        "
                        style="height: calc(100vh - 45px - 24px)"
                        :folder-types="folderTypesStore.folderTypes"
                        :pomodoro-settings="
                            pomodoroSettingStore.pomodoroSettings
                        "
                        :selected-task="tasksStore.selectedUpdateTask"
                        @update-task="
                            tasksStore.debouncedUpdateTaskAndAutoRetryOnError(
                                $event.formValue
                            )
                        "
                        @delete-task="
                            tasksStore.deleteTask(
                                tasksStore.selectedUpdateTaskId
                            )
                        "
                        @break-pomodoro="pomodoroClockStore.breakPomodoro"
                    />
                </div>
            </section>
        </main>
        <!-- home-pomodoro-clock -->
        <HomePomodoroClock
            class="home-pomodoro-clock"
            :timer="pomodoroClockStore.timer"
            :selected-task-id="pomodoroClockStore.selectedTaskId"
            :selected-task="pomodoroClockStore.selectedTask"
            :is-show-pomodoro-modal="pomodoroClockStore.isShowPomodoroModal"
            :pomodoro-settings="pomodoroSettingStore.pomodoroSettings"
            @delete-task="
                tasksStore.deleteTask(pomodoroClockStore.selectedTaskId)
            "
            @update-task="tasksStore.debouncedUpdateTaskAndAutoRetryOnError"
            @start-pomodoro="pomodoroClockStore.startPomodoro"
            @stop-pomodoro="pomodoroClockStore.stopPomodoro"
            @break-pomodoro="pomodoroClockStore.breakPomodoro"
            @open-pomodoro-modal="pomodoroClockStore.openPomodoroModal"
            @close-pomodoro-modal="pomodoroClockStore.closePomodoroModal"
        />
    </section>
</template>

<style lang="scss" scoped>
.home {
    button {
        font-size: 0px;
    }
}

.home-workspace {
    display: flex;
}

.workspace-sidebar {
    height: calc(100vh - 45px);
}

.home-time-sum {
    margin-bottom: 24px;
}

.workspace-current-task {
    flex: 1 1 auto;
    display: flex;
    padding: 12px;
    height: calc(100vh - 45px);

    background-color: $gray-0;

    .task-list {
        flex: 1 1 auto;
        margin-right: 12px;
        transition: all 0.3s ease;

        h2 {
            font-size: 24px;
            line-height: 36px;
            font-weight: 400;
        }

        button {
            padding: 4px;
            background-color: $gray-1;
            border-radius: 4px;
        }

        .list-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
        }

        .home-add-task {
            margin-bottom: 24px;
        }

        .home-list {
            margin-bottom: 24px;
            height: calc(100vh - 300px);
            overflow: scroll;

            -ms-overflow-style: none; /* Internet Explorer 10+ */
            scrollbar-width: none; /* Firefox */

            &::-webkit-scrollbar {
                display: none; /* Safari and Chrome */
            }
        }
    }

    .task-detail {
        &.no-show {
            display: none;
        }
    }
}

.home-pomodoro-clock {
    position: fixed;
    top: auto;
    bottom: 24px;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 999;
}

.error-model-text {
    text-align: center;
    font-size: 14px;
}

.error-model-footer {
    text-align: center;
}
</style>
