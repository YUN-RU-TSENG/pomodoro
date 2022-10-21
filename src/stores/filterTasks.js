import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useFolderTypesStore } from '@/stores/folderTypes'
import dayjs from 'dayjs'

export const useFilterTasksStore = defineStore('filterTasks', () => {
    const tasksStore = useTasksStore()
    const { tasks } = storeToRefs(tasksStore)

    const filterTasksStore = useFolderTypesStore()
    const { folderTypes } = storeToRefs(filterTasksStore)

    // 過濾選項
    const { filterTaskOptions } = useFilterTaskOptions()

    // 過濾選項，整理格式為 sidebar 呈現的內容 (含任務時數、任務總數)
    const { filterTaskOptionsFormatForSidebar } =
        useFilterTaskOptionsFormatForSidebar({
            tasks,
            filterTaskOptions,
        })

    // 資料夾過濾選項
    const { filterTaskFolderOptions } = useFilterTaskFolderOptions({
        folderTypes,
    })

    // 資料夾過濾選項，整理格式為 sidebar 呈現的內容 (含任務時數、任務總數)
    const { filterTaskFolderOptionsFormatForSidebar } =
        useFilterTaskFolderOptionsFormatForSidebar({
            filterTaskFolderOptions,
            tasks,
        })

    // selected 過濾選項，預設為 'all'(全部)
    const selectedFilterOption = useSelectFilterOption({ filterTaskOptions })

    // 當前過濾選項過濾的 tasks
    const { filterTasks } = useFilterTasks({ selectedFilterOption, tasks })

    return {
        filterTaskFolderOptionsFormatForSidebar,
        filterTaskOptionsFormatForSidebar,
        filterTasks,
        selectedFilterOption,
    }
})

// 過濾選項
function useFilterTaskOptions() {
    const filterTaskOptions = [
        {
            key: 'taskOfToday',
            name: '今天',
            imgName: 'sun.png',
            filterFun: (tasks) =>
                tasks.filter((task) => {
                    if (task.expectEndDate)
                        return dayjs(task.expectEndDate).isSame(dayjs(), 'day')
                }),
        },
        {
            key: 'taskOfFuture',
            name: '稍後',
            imgName: 'external-sunset-3.png',
            filterFun: (tasks) =>
                tasks.filter((task) => {
                    if (task.expectEndDate)
                        return dayjs(task.expectEndDate).isAfter(dayjs(), 'day')
                }),
        },
        {
            key: 'taskOfNoExpectTime',
            name: '尚未安排',
            imgName: 'calendar--v1-1.png',
            filterFun: (tasks) =>
                tasks.filter((task) => {
                    return !task.expectEndDate
                }),
        },
        {
            key: 'taskOfFinish',
            name: '全部',
            imgName: 'calendar--v1-2.png',
            filterFun: (tasks) => tasks,
        },
        {
            key: 'taskOfTheFolder',
            name: '已完成',
            imgName: 'checked.png',
            filterFun: (tasks) =>
                tasks.filter((task) => {
                    return task.isFinish
                }),
        },
    ]

    return {
        filterTaskOptions,
    }
}

// 過濾選項，整理格式為 sidebar 呈現的內容 (含任務時數、任務總數)
function useFilterTaskOptionsFormatForSidebar({ tasks, filterTaskOptions }) {
    const filterTaskOptionsFormatForSidebar = computed(() => {
        return filterTaskOptions.map((option) => {
            const filterTasks = option.filterFun(tasks.value)
            const filterTasksNumber = filterTasks.length
            const filterTasksTotalExpectTime = filterTasks.reduce(
                (acc, cur) => {
                    return acc + cur.totalExpectTime
                },
                0
            )

            return {
                ...option,
                tasksNumber: filterTasksNumber,
                tasksTotalExpectTime: filterTasksTotalExpectTime,
            }
        })
    })

    return {
        filterTaskOptionsFormatForSidebar,
    }
}

// 資料夾過濾選項
function useFilterTaskFolderOptions({ folderTypes }) {
    const filterTaskFolderOptions = computed(() => {
        return folderTypes.value.map((folder) => {
            return {
                key: 'folder',
                name: folder.name,
                filterFun: (tasks, folder) =>
                    tasks.filter((task) => {
                        return task.folder === folder.name
                    }),
            }
        })
    })

    return {
        filterTaskFolderOptions,
    }
}

// 資料夾過濾選項，整理格式為 sidebar 呈現的內容 (含任務時數、任務總數)
function useFilterTaskFolderOptionsFormatForSidebar({
    filterTaskFolderOptions,
    tasks,
}) {
    const filterTaskFolderOptionsFormatForSidebar = computed(() => {
        return filterTaskFolderOptions.value.map((folderOption) => {
            const folderTasks = tasks.value.filter(
                (task) => task.folder === folderOption.name
            )

            const folderTasksNumber = folderTasks.length

            const folderTasksTotalExpectTime = folderTasks.reduce(
                (acc, cur) => {
                    return acc + cur.totalExpectTime
                },
                0
            )

            return {
                ...folderOption,
                tasksNumber: folderTasksNumber,
                tasksTotalExpectTime: folderTasksTotalExpectTime,
            }
        })
    })

    return { filterTaskFolderOptionsFormatForSidebar }
}

// selected 過濾選項，預設為 'all'(全部)
function useSelectFilterOption({ filterTaskOptions }) {
    const selectedFilterOption = ref(filterTaskOptions[3])

    return {
        selectedFilterOption,
    }
}

// 當前過濾選項過濾的 tasks
function useFilterTasks({ selectedFilterOption, tasks }) {
    const filterTasks = computed(() => {
        return selectedFilterOption.value.filterFun(
            tasks.value,
            selectedFilterOption.value.key === 'folder' &&
                selectedFilterOption.value.name
        )
    })

    return {
        filterTasks,
    }
}
