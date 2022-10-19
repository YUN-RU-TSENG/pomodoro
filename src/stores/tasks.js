import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    query,
    doc,
    where,
    db,
} from '@/utils/firebaseStore'
import { useUserStore } from './user'
import dayjs from 'dayjs'
import { useDebounceFn } from '@vueuse/core'

export const useTasksStore = defineStore('tasks', () => {
    // userStore
    const userStore = useUserStore()

    // firebaseTaskRef
    const { firebaseRefTask, firebaseRefUserTask } = useFirebaseTaskRef({
        userStore,
    })

    // tasks - get
    const { tasks, getTasks, isLoadingTaskGet } = useGetTasks({
        firebaseRefUserTask,
    })

    // tasks - add
    const { addTask, isLoadingTaskAdd, errorOfTaskAdd } = useAddTask({
        firebaseRefTask,
        getTasks,
        userStore,
    })

    // tasks - update
    const {
        selectedUpdateTaskId,
        selectedUpdateTask,
        updateTask,
        isLoadingTaskUpdate,
        errorOfTaskUpdate,
    } = useUpdateTask({
        tasks,
        getTasks,
    })

    // tasks - delete
    const { deleteTask, isLoadingTaskDelete } = useDeleteTask({
        getTasks,
        selectedUpdateTaskId,
    })

    // tasks - debounce update
    const { debouncedUpdateTaskAndAutoRetryOnError } =
        useDebouncedUpdateTaskAndAutoResendUpdateOnError({
            updateTask,
            errorOfTaskUpdate,
            selectedUpdateTaskId,
        })

    const { filterTasks, changeFilterType, filterType } = useFilterTask({
        tasks,
    })

    // tasks - 任務細項的總和相關資訊
    const {
        theSumOfExpectTimeOfTask,
        theSumOfSpendTimeOfTask,
        theSumOfNumberOfTasks,
        theSumOfNumberOfUnFinishTasks,
        theSumOfNumberOfFinishTasks,
    } = useSumOfTasksItem({ tasks })

    return {
        tasks,
        getTasks,
        isLoadingTaskGet,
        addTask,
        isLoadingTaskAdd,
        errorOfTaskAdd,
        selectedUpdateTaskId,
        selectedUpdateTask,
        updateTask,
        isLoadingTaskUpdate,
        errorOfTaskUpdate,
        debouncedUpdateTaskAndAutoRetryOnError,
        deleteTask,
        isLoadingTaskDelete,
        filterType,
        filterTasks,
        changeFilterType,
        theSumOfExpectTimeOfTask,
        theSumOfSpendTimeOfTask,
        theSumOfNumberOfTasks,
        theSumOfNumberOfUnFinishTasks,
        theSumOfNumberOfFinishTasks,
    }
})

function useFirebaseTaskRef({ userStore }) {
    const firebaseRefTask = collection(db, 'tasks')

    const firebaseRefUserTask = query(
        collection(db, 'tasks'),
        where('uid', '==', userStore.user.uid)
    )

    return {
        firebaseRefTask,
        firebaseRefUserTask,
    }
}

function useGetTasks({ firebaseRefUserTask }) {
    const tasks = ref([])
    const isLoadingTaskGet = ref(false)

    /**
     * 讀取 task
     */
    const getTasks = async () => {
        try {
            isLoadingTaskGet.value = true

            const taskSnapshot = await getDocs(firebaseRefUserTask)
            const tasksSnapshotData = []

            taskSnapshot.forEach((taskSnapshotData) => {
                tasksSnapshotData.push({
                    ...taskSnapshotData.data(),
                    id: taskSnapshotData.id,
                })
            })

            tasks.value = tasksSnapshotData
        } catch (error) {
            console.error(error)
        } finally {
            isLoadingTaskGet.value = false
        }
    }

    return {
        tasks,
        getTasks,
        isLoadingTaskGet,
    }
}

function useAddTask({ firebaseRefTask, getTasks, userStore }) {
    const isLoadingTaskAdd = ref(false)
    const errorOfTaskAdd = ref(null)

    // 新增 task
    const addTask = async (formValue) => {
        try {
            isLoadingTaskAdd.value = true
            errorOfTaskAdd.value = null

            await addDoc(firebaseRefTask, {
                uid: userStore.user.uid,
                ...formValue,
            })

            getTasks()
        } catch (error) {
            console.error(error)
            errorOfTaskAdd.value = error
        } finally {
            isLoadingTaskAdd.value = true
        }
    }

    return {
        addTask,
        errorOfTaskAdd,
        isLoadingTaskAdd,
    }
}

function useUpdateTask({ tasks, getTasks }) {
    const selectedUpdateTaskId = ref('')
    const isLoadingTaskUpdate = ref(false)
    const errorOfTaskUpdate = ref(null)

    const selectedUpdateTask = computed(() => {
        const [result] = tasks.value.filter(
            (task) => task.id === selectedUpdateTaskId.value
        )
        return result ? JSON.parse(JSON.stringify(result)) : null
    })

    // 更新 task
    const updateTask = async (formValue) => {
        try {
            errorOfTaskUpdate.value = null
            isLoadingTaskUpdate.value = true

            const currentEditTaskReference = doc(
                db,
                'tasks',
                selectedUpdateTaskId.value
            )

            await updateDoc(currentEditTaskReference, formValue)

            getTasks()
        } catch (error) {
            errorOfTaskUpdate.value = error
            console.error(error)
        } finally {
            isLoadingTaskUpdate.value = false
        }
    }

    return {
        selectedUpdateTask,
        selectedUpdateTaskId,
        updateTask,
        isLoadingTaskUpdate,
        errorOfTaskUpdate,
    }
}

function useDebouncedUpdateTaskAndAutoResendUpdateOnError({
    updateTask,
    errorOfTaskUpdate,
    selectedUpdateTaskId,
}) {
    // 自動每三秒發送一次的 interval Id
    const timeIntervalId = ref(null)

    // 當 update task id 更新，刪除 interval Id
    watch(selectedUpdateTaskId, () => {
        if (timeIntervalId.value) clearTimeout(timeIntervalId.value)
        timeIntervalId.value = null
    })

    const updateTaskAndAutoResendUpdateFormOnError = async (formValue) => {
        await updateTask(formValue)

        // 判斷當修改失敗，自動每三秒發送一次，一但成功，就取消當前的 每三秒發送一次的 interval Id
        if (errorOfTaskUpdate.value) {
            timeIntervalId.value = setTimeout(
                () => updateTask(formValue),
                3 * 1000
            )
        }
    }

    const debouncedUpdateTaskAndAutoRetryOnError = useDebounceFn(
        updateTaskAndAutoResendUpdateFormOnError,
        1 * 1000
    )

    return {
        debouncedUpdateTaskAndAutoRetryOnError,
    }
}

function useDeleteTask({ getTasks, selectedUpdateTaskId }) {
    const isLoadingTaskDelete = ref(false)

    // 刪除 task
    const deleteTask = async (cacheDeleteTaskId) => {
        try {
            isLoadingTaskDelete.value = true

            const currentDocumentReference = doc(db, 'tasks', cacheDeleteTaskId)

            await deleteDoc(currentDocumentReference)
            selectedUpdateTaskId.value = null

            getTasks()
        } catch (error) {
            console.error(error)
        } finally {
            isLoadingTaskDelete.value = false
        }
    }

    return { deleteTask, isLoadingTaskDelete }
}

function useFilterTask({ tasks }) {
    const filterTypes = [
        'taskOfToday', // 0
        'taskOfFuture', // 1
        'taskOfPrimary', // 2
        'taskOfSecondary', // 3
        'taskOfTertiary', // 4
        'taskOfNoTime', // 5
        'taskOfFinish', // 6
        'all', // 7
    ]
    const filterType = ref('all')

    // 更新 filterType 為 filterTypes 中的任意一種
    const changeFilterType = (type) => {
        filterType.value = filterTypes[type]
    }

    const taskOfToday = computed(() => {
        return tasks.value.filter((task) => {
            if (!task.expectEndDate) return
            return dayjs(task.expectEndDate).isSame(dayjs(), 'day')
        })
    })

    const taskOfFuture = computed(() => {
        return tasks.value.filter((task) => {
            if (!task.expectEndDate) return
            return dayjs(task.expectEndDate).isAfter(dayjs(), 'day')
        })
    })

    const taskOfNoTime = computed(() => {
        return tasks.value.filter((task) => {
            return !task.expectEndDate
        })
    })

    const taskOfPrimary = computed(() => {
        return tasks.value.filter((task) => {
            return task.level === 'primary'
        })
    })

    const taskOfSecondary = computed(() => {
        return tasks.value.filter((task) => {
            return task.level === 'secondary'
        })
    })

    const taskOfTertiary = computed(() => {
        return tasks.value.filter((task) => {
            return task.level === 'tertiary'
        })
    })

    const taskOfFinish = computed(() => {
        return tasks.value.filter((task) => {
            return task.isFinish
        })
    })

    const filterTasks = computed(() => {
        if (filterType.value === 'taskOfToday') return taskOfToday.value
        if (filterType.value === 'taskOfFuture') return taskOfFuture.value
        if (filterType.value === 'taskOfPrimary') return taskOfPrimary.value
        if (filterType.value === 'taskOfSecondary') return taskOfSecondary.value
        if (filterType.value === 'taskOfTertiary') return taskOfTertiary.value
        if (filterType.value === 'taskOfNoTime') return taskOfNoTime.value
        if (filterType.value === 'taskOfFinish') return taskOfFinish.value
        return tasks.value // all
    })

    return { filterTasks, changeFilterType, filterType }
}

function useSumOfTasksItem({ tasks }) {
    // 任務總預估時間
    const theSumOfExpectTimeOfTask = computed(() => {
        return tasks.value
            .filter((item) => !item.isFinish && !!item.totalExpectTime)
            .reduce((acc, cur) => {
                return acc + cur.totalExpectTime
            }, 0)
    })

    // 任務總專注時間
    const theSumOfSpendTimeOfTask = computed(() => {
        return tasks.value
            .filter((item) => !item.isFinish && !!item.totalSpendTime)
            .reduce((acc, cur) => {
                return acc + cur.totalSpendTime
            }, 0)
    })

    // 任務數量總和
    const theSumOfNumberOfTasks = computed(() => {
        return tasks.value.length
    })

    // 未完成任務數量總和
    const theSumOfNumberOfUnFinishTasks = computed(() => {
        return tasks.value.filter((item) => !item.isFinish).length
    })

    // 完成任務數量總和
    const theSumOfNumberOfFinishTasks = computed(() => {
        return tasks.value.filter((item) => !!item.isFinish).length
    })

    return {
        theSumOfExpectTimeOfTask,
        theSumOfSpendTimeOfTask,
        theSumOfNumberOfTasks,
        theSumOfNumberOfUnFinishTasks,
        theSumOfNumberOfFinishTasks,
    }
}
