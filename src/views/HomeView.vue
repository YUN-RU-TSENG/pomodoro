<script setup>
import { onBeforeMount } from 'vue'
import { useUserStore } from '@/stores/user'
import { useTasksStore } from '@/stores/tasks'
import { usePomorodoClockStore } from '@/stores/pomorodoClock'
import { useFileTypesStore } from '@/stores/fileTypes'

const userStore = useUserStore()
const tasksStore = useTasksStore()
const pomorodoClockStore = usePomorodoClockStore()
const fileTypesStore = useFileTypesStore()

onBeforeMount(() => {
    tasksStore.getTasks()
    fileTypesStore.getFileTypes()
})

function deleteTask(deleteId) {
    // 由於刪除的是當前快取編輯的 task，所以刪除時同時需要清除當前快取編輯的 task id
    tasksStore.clearCacheUpdateTaskId()
    tasksStore.deleteTask(deleteId)
}
</script>

<template>
    <section class="home">
        <!-- home home-navbar -->
        <HomeNavbar
            class="home-navbar"
            :user="userStore.user"
            @user-logout="userStore.logout"
        />
        <!-- home home-workspace -->
        <main class="home-workspace">
            <!-- workspace-sidebar -->
            <HomeSidebar
                class="workspace-sidebar"
                style="height: calc(100vh - 45px)"
                :filter-type="tasksStore.filterType"
                :each-file-type-total-task-time="
                    fileTypesStore.eachFileTypeTotalTaskTime
                "
                :is-loading-file-types-add="
                    fileTypesStore.isLoadingFileTypesAdd
                "
                @add-file-type="fileTypesStore.addFileType($event)"
                @update:filter-type="tasksStore.changeFilterType($event)"
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
                        :pomorodo-time="tasksStore.cacheAddForm.pomorodoTime"
                        :file-types="fileTypesStore.fileTypes"
                        :cache-add-form="tasksStore.cacheAddForm"
                        @add-tasks="tasksStore.addTask"
                        @update:total-expect-time="
                            tasksStore.cacheAddForm.totalExpectTime = $event
                        "
                        @update:cache-add-form-folder="
                            tasksStore.cacheAddForm.folder = $event
                        "
                    >
                        <template #name>
                            <HomeAddInput
                                v-model:value="tasksStore.cacheAddForm.name"
                                placeholder="輸入待辦 task，例如: 閱讀書籍"
                            />
                        </template>
                        <template #clocks>
                            <HomeAddTaskClocks
                                v-model:totalExpectTime="
                                    tasksStore.cacheAddForm.totalExpectTime
                                "
                                :pomorodo-time="
                                    tasksStore.cacheAddForm.pomorodoTime
                                "
                            />
                        </template>
                    </HomeAddTask>
                    <HomeList
                        class="home-list"
                        :is-loading="tasksStore.isLoadingTaskGet"
                    >
                        <HomeListItem
                            v-for="task of tasksStore.filterTasks"
                            :key="task.id"
                            v-model:pomorodoSelectedTaskId="
                                pomorodoClockStore.selectedTaskId
                            "
                            :task="task"
                            @open-task-detail="
                                tasksStore.cacheUpdateTaskId = task.id
                            "
                            @close-task-detail="() => {}"
                            @update:task="log('@update:task')"
                            @play-pomorodo="log('@play-pomorodo')"
                        />
                    </HomeList>
                </div>
                <div v-if="tasksStore.cacheUpdateTaskId" class="task-detail">
                    <!-- HomeTaskEditBar -->
                    <HomeTaskEditBar
                        v-model:pomorodoSelectedTaskId="
                            pomorodoClockStore.selectedTaskId
                        "
                        style="height: calc(100vh - 45px - 24px)"
                        :cache-update-form="tasksStore.cacheUpdateForm"
                        :file-types="fileTypesStore.fileTypes"
                        @update:cache-update-form="
                            tasksStore.setUpdateFormValues($event)
                        "
                        @delete-task="deleteTask(tasksStore.cacheUpdateTaskId)"
                        @close-task-detail="tasksStore.clearCacheUpdateTaskId()"
                    />
                </div>
            </section>
        </main>
        <!-- home-pomorodo-clock -->
        <HomePomorodoClock
            class="home-pomorodo-clock"
            :timer="pomorodoClockStore.timer"
            :selected-task-id="pomorodoClockStore.selectedTaskId"
            :selected-task="pomorodoClockStore.selectedTask"
            :is-show-pomorodo-modal="pomorodoClockStore.isShowPomorodoModal"
            :start-pomorodo="pomorodoClockStore.startPomorodo"
            :stop-pomorodo="pomorodoClockStore.stopPomorodo"
            :break-pomorodo="pomorodoClockStore.breakPomorodo"
            :open-pomorodo-modal="pomorodoClockStore.openPomorodoModal"
            :close-pomorodo-modal="pomorodoClockStore.closePomorodoModal"
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

.home-list {
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
