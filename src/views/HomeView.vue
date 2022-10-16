<script setup>
import { useUserStore } from '@/stores/user'
import { useTasksStore } from '@/stores/tasks'
import { usePomorodoClockStore } from '@/stores/pomorodoClock'
import { useFolderTypesStore } from '@/stores/folderTypes'
import { storeToRefs } from 'pinia'

// ========== pinia ==========

// pinia - userStore
const userStore = useUserStore()
const { user, logout } = storeToRefs(userStore)

// pinia - tasksStore
const tasksStore = useTasksStore()
const {
    filterType,
    cacheAddForm,
    isLoadingTaskGet,
    cacheUpdateTaskId,
    cacheUpdateForm,
    filterTasks,
} = storeToRefs(tasksStore)
const {
    getTasks,
    deleteTask,
    clearCacheUpdateTaskId,
    changeFilterType,
    addTask,
    setUpdateFormValues,
} = tasksStore

// pinia - pomorodoClockStore
const pomorodoClockStore = usePomorodoClockStore()
const { selectedTaskId, timer, selectedTask, isShowPomorodoModal } =
    storeToRefs(pomorodoClockStore)
const {
    startPomorodo,
    stopPomorodo,
    breakPomorodo,
    openPomorodoModal,
    closePomorodoModal,
} = pomorodoClockStore

// pinia - folderTypesStore
const folderTypesStore = useFolderTypesStore()
const { eachFolderTypeTotalTaskTime, isLoadingFolderTypesAdd, folderTypes } =
    storeToRefs(folderTypesStore)
const { getFolderTypes, addFolderType } = folderTypesStore

// ========== component logic ==========

getTasks()
getFolderTypes()

// ========== component scoped composables function ==========

// 由於刪除的是當前快取編輯的 task，所以刪除時同時需要清除當前快取編輯的 task id
function deleteTaskAndClearCacheUpdateTaskId(deleteId) {
    clearCacheUpdateTaskId()
    deleteTask(deleteId)
}
</script>

<template>
    <section class="home">
        <!-- home home-navbar -->
        <HomeNavbar class="home-navbar" :user="user" @user-logout="logout" />
        <!-- home home-workspace -->
        <main class="home-workspace">
            <!-- workspace-sidebar -->
            <HomeSidebar
                class="workspace-sidebar"
                style="height: calc(100vh - 45px)"
                :filter-type="filterType"
                :each-folder-type-total-task-time="eachFolderTypeTotalTaskTime"
                :is-loading-folder-types-add="isLoadingFolderTypesAdd"
                @add-folder-type="addFolderType($event)"
                @update:filter-type="changeFilterType($event)"
            />
            <!-- workspace-current-task -->
            <section class="workspace-current-task">
                <div class="task-list">
                    <div class="list-title">
                        <h2>今天</h2>
                        <button class="sort">
                            <img
                                src="https://img.icons8.com/fluency-systems-filled/48/000000/sort.png"
                                width="20"
                            />1
                        </button>
                    </div>
                    <HomeAddTask
                        :pomorodo-time="cacheAddForm.pomorodoTime"
                        :folder-types="folderTypes"
                        :cache-add-form="cacheAddForm"
                        @add-tasks="addTask"
                        @update:total-expect-time="
                            cacheAddForm.totalExpectTime = $event
                        "
                        @update:cache-add-form-folder="
                            cacheAddForm.folder = $event
                        "
                    >
                        <template #name>
                            <HomeAddInput
                                v-model:value="cacheAddForm.name"
                                placeholder="輸入待辦 task，例如: 閱讀書籍"
                            />
                        </template>
                        <template #clocks>
                            <HomeAddTaskClocks
                                v-model:totalExpectTime="
                                    cacheAddForm.totalExpectTime
                                "
                                :pomorodo-time="cacheAddForm.pomorodoTime"
                            />
                        </template>
                    </HomeAddTask>
                    <HomeList class="home-list" :is-loading="isLoadingTaskGet">
                        <HomeListItem
                            v-for="task of filterTasks"
                            :key="task.id"
                            v-model:cache-update-task-id="cacheUpdateTaskId"
                            v-model:pomorodo-selected-task-id="selectedTaskId"
                            :task="task"
                            @update:task="log('@update:task')"
                        />
                    </HomeList>
                </div>
                <div v-if="cacheUpdateTaskId" class="task-detail">
                    <!-- HomeTaskEditBar -->
                    <HomeTaskEditBar
                        v-model:pomorodoSelectedTaskId="selectedTaskId"
                        style="height: calc(100vh - 45px - 24px)"
                        :cache-update-form="cacheUpdateForm"
                        :folder-types="folderTypes"
                        @update:cache-update-form="setUpdateFormValues($event)"
                        @delete-task="
                            deleteTaskAndClearCacheUpdateTaskId(
                                cacheUpdateTaskId
                            )
                        "
                        @close-task-detail="clearCacheUpdateTaskId"
                    />
                </div>
            </section>
        </main>
        <!-- home-pomorodo-clock -->
        <HomePomorodoClock
            class="home-pomorodo-clock"
            :timer="timer"
            :selected-task-id="selectedTaskId"
            :selected-task="selectedTask"
            :is-show-pomorodo-modal="isShowPomorodoModal"
            :start-pomorodo="startPomorodo"
            :stop-pomorodo="stopPomorodo"
            :break-pomorodo="breakPomorodo"
            :open-pomorodo-modal="openPomorodoModal"
            :close-pomorodo-modal="closePomorodoModal"
        />
    </section>
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
        }
    }

    .task-detail {
        &.no-show {
            display: none;
        }
    }
}

.home-pomorodo-clock {
    position: fixed;
    top: auto;
    bottom: 24px;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 999;
}
</style>
