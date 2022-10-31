<script setup>
import { useUserStore } from '@/stores/user'
import { useTasksStore } from '@/stores/tasks'
import { usePomodoroClockStore } from '@/stores/pomodoroClock'
import { useFolderTypesStore } from '@/stores/folderTypes'
import { usePomodoroSetting } from '@/stores/pomodoroSetting'
import { useFilterTasksStore } from '@/stores/filterTasks'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref } from 'vue'

/* ========== pinia ========== */

// pinia - userStore
const userStore = useUserStore()
const { user, errorOfLogout } = storeToRefs(userStore)
const { logout } = userStore

// pinia - filterTasksStore
const filterTasksStore = useFilterTasksStore()
const {
    filterTasks,
    filterTaskFolderOptionsFormatForSidebar,
    filterTaskOptionsFormatForSidebar,
    selectedFilterOption,
} = storeToRefs(filterTasksStore)

// pinia - tasksStore
const tasksStore = useTasksStore()
const {
    isLoadingTaskGet,
    errorOfTaskAdd,
    selectedUpdateTaskId,
    selectedUpdateTask,
    theSumOfExpectTimeOfTask,
    theSumOfSpendTimeOfTask,
    theSumOfNumberOfUnFinishTasks,
    theSumOfNumberOfFinishTasks,
} = storeToRefs(tasksStore)
const {
    getTasks,
    deleteTask,
    addTask,
    debouncedUpdateTaskAndAutoRetryOnError,
} = tasksStore

// pinia - pomodoroClockStore
const pomodoroClockStore = usePomodoroClockStore()
const { selectedTaskId, timer, selectedTask, isShowPomodoroModal } =
    storeToRefs(pomodoroClockStore)
const {
    startPomodoro,
    stopPomodoro,
    breakPomodoro,
    openPomodoroModal,
    closePomodoroModal,
} = pomodoroClockStore

// pinia - folderTypesStore
const folderTypesStore = useFolderTypesStore()
const { isLoadingFolderTypesAdd, folderTypes } = storeToRefs(folderTypesStore)
const { getFolderTypes, addFolderType } = folderTypesStore

// pinia - pomodoroSettingStore
const pomodoroSettingStore = usePomodoroSetting()
const {
    pomodoroSettings,
    isLoadingPomodoroSettingGet,
    errorOfPomodoroSettingGet,
} = storeToRefs(pomodoroSettingStore)
const { getPomodoroSettingAndAutoCreateDefaultValue } = pomodoroSettingStore

/* ========== component logic ========== */

// addTask
const { handleAddTask } = useHandleAddTask({ addTask, errorOfTaskAdd })
const { handleLogout } = useHandleLogout({ logout, errorOfLogout })
const { handleGetPomodoroSetting, isShowPomodoroSettingErrorModal } =
    useHandleGetPomodoroSetting({
        getPomodoroSettingAndAutoCreateDefaultValue,
        errorOfPomodoroSettingGet,
    })

onBeforeMount(async () => {
    // getTask
    getTasks()

    // folder
    getFolderTypes()

    // pomodoroSetting
    handleGetPomodoroSetting()
})

/*========== component scoped composables function ========== */

// addTask
function useHandleAddTask({ addTask, errorOfTaskAdd }) {
    const handleAddTask = async ({ formValue, resetForm }) => {
        await addTask(formValue)
        // 判斷當添加成功，重置表單
        if (!errorOfTaskAdd.value) resetForm()
    }

    return {
        handleAddTask,
    }
}

// logout
function useHandleLogout({ logout, errorOfLogout }) {
    const handleLogout = async () => {
        await logout()
        if (!errorOfLogout.value) location.reload()
    }
    return { handleLogout }
}

// handleGetPomodoroSetting
function useHandleGetPomodoroSetting({
    getPomodoroSettingAndAutoCreateDefaultValue,
    errorOfPomodoroSettingGet,
}) {
    const isShowPomodoroSettingErrorModal = ref(false)

    const handleGetPomodoroSetting = async () => {
        await getPomodoroSettingAndAutoCreateDefaultValue()
        if (errorOfPomodoroSettingGet.value) {
            isShowPomodoroSettingErrorModal.value = true
        }
    }

    return { handleGetPomodoroSetting, isShowPomodoroSettingErrorModal }
}
</script>

<template>
    <section class="home">
        <!-- home home-navbar -->
        <HomeNavbar
            class="home-navbar"
            :user="user"
            @user-logout="handleLogout"
        />
        <!-- home home-workspace -->
        <main class="home-workspace">
            <!-- workspace-sidebar -->
            <HomeSidebar
                v-model:selected-filter-option="selectedFilterOption"
                :filter-task-folder-options-format-for-sidebar="
                    filterTaskFolderOptionsFormatForSidebar
                "
                :filter-task-options-format-for-sidebar="
                    filterTaskOptionsFormatForSidebar
                "
                class="workspace-sidebar"
                :is-loading-folder-types-add="isLoadingFolderTypesAdd"
                @add-folder-type="addFolderType($event)"
            />
            <!-- workspace-current-task -->
            <section class="workspace-current-task">
                <div class="task-list">
                    <div class="list-title">
                        <h2>{{ selectedFilterOption.name }}</h2>
                        <button class="sort">
                            <img src="@/assets/images/sort.png" width="20" />
                        </button>
                    </div>
                    <HomeTimeSum
                        class="home-time-sum"
                        :the-sum-of-expect-time-of-task="
                            theSumOfExpectTimeOfTask
                        "
                        :the-sum-of-spend-time-of-task="theSumOfSpendTimeOfTask"
                        :the-sum-of-number-of-un-finish-tasks="
                            theSumOfNumberOfUnFinishTasks
                        "
                        :the-sum-of-number-of-finish-tasks="
                            theSumOfNumberOfFinishTasks
                        "
                    />
                    <HomeAddTask
                        :folder-types="folderTypes"
                        :pomodoro-settings="pomodoroSettings"
                        @add-tasks="handleAddTask"
                    />
                    <HomeList
                        class="home-list"
                        :is-loading="isLoadingTaskGet"
                        title="Tasks"
                    >
                        <HomeListItem
                            v-for="task of filterTasks"
                            :key="task.id"
                            v-model:cache-update-task-id="selectedUpdateTaskId"
                            v-model:pomodoro-selected-task-id="selectedTaskId"
                            :task="task"
                            :pomodoro-settings="pomodoroSettings"
                        />
                    </HomeList>
                </div>
                <div v-if="selectedUpdateTaskId" class="task-detail">
                    <HomeTaskEditBar
                        v-model:selected-task-id="selectedUpdateTaskId"
                        v-model:pomodoro-selected-task-id="selectedTaskId"
                        style="height: calc(100vh - 45px - 24px)"
                        :folder-types="folderTypes"
                        :pomodoro-settings="pomodoroSettings"
                        :selected-task="selectedUpdateTask"
                        @update-task="
                            debouncedUpdateTaskAndAutoRetryOnError(
                                $event.formValue
                            )
                        "
                        @delete-task="deleteTask(selectedUpdateTaskId)"
                        @break-pomodoro="breakPomodoro"
                    />
                </div>
            </section>
        </main>
        <!-- home-pomodoro-clock -->
        <HomePomodoroClock
            class="home-pomodoro-clock"
            :timer="timer"
            :selected-task-id="selectedTaskId"
            :selected-task="selectedTask"
            :is-show-pomodoro-modal="isShowPomodoroModal"
            :pomodoro-settings="pomodoroSettings"
            @delete-task="deleteTask(selectedTaskId)"
            @update-task="debouncedUpdateTaskAndAutoRetryOnError"
            @start-pomodoro="startPomodoro"
            @stop-pomodoro="stopPomodoro"
            @break-pomodoro="breakPomodoro"
            @open-pomodoro-modal="openPomodoroModal"
            @close-pomodoro-modal="closePomodoroModal"
        />
    </section>
    <BaseModal
        v-if="isShowPomodoroSettingErrorModal"
        class="home-folder-modal-confirm"
    >
        <template #header> 初始錯誤 </template>
        <template #body>
            <p class="error-model-text">加載用戶設置錯誤，請重新載入</p>
        </template>
        <template #footer>
            <div class="error-model-footer">
                <BaseButton color="primary" @click="handleGetPomodoroSetting"
                    >重新載入</BaseButton
                >
            </div>
        </template>
    </BaseModal>
    <BaseLoading v-if="isLoadingPomodoroSettingGet" text="加載用戶配置" />
</template>

<style lang="scss" scoped>
.home {
    button {
        font-size: 0px;
    }
}

.home-navbar {
    z-index: 9;
    position: relative;
}

.home-workspace {
    display: flex;
    position: relative;
    z-index: 1;
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
