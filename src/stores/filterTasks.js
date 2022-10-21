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

    // ---
    // 過濾選項
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

    // 過濾選項 (含任務時數、任務總數)
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

    // 資料夾過濾選項
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

    // 資料夾過濾選項 (含任務時數、任務總數)
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

    // type of task filter
    const selectedFilterOption = ref(filterTaskOptions[3])

    const filterTasks = computed(() => {
        return selectedFilterOption.value.filterFun(
            tasks.value,
            selectedFilterOption.value.key === 'folder' &&
                selectedFilterOption.value.name
        )
    })

    // 過濾的當前任務，根據丟入的過濾選項來過濾當前任務
    // ---

    return {
        filterTaskFolderOptionsFormatForSidebar,
        filterTaskOptionsFormatForSidebar,
        filterTasks,
        selectedFilterOption,
    }
})
