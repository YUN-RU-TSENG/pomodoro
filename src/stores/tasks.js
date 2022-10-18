import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

export const useTasksStore = defineStore('tasks', () => {
    // userStore
    const userStore = useUserStore()

    // firebaseTaskRef
    const { firebaseRefTask, firebaseRefUserTask } = useFirebaseTaskRef({
        userStore,
    })

    // tasks
    const { tasks, getTasks, isLoadingTaskGet } = useGetTasks({
        firebaseRefUserTask,
    })
    const { addTask, isLoadingTaskAdd, errorOfTaskAdd } = useAddTask({
        firebaseRefTask,
        getTasks,
        userStore,
    })
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
    const { deleteTask, isLoadingTaskDelete } = useDeleteTask({
        getTasks,
        selectedUpdateTaskId,
    })
    const { filterTasks, changeFilterType, filterType } = useFilterTask({
        tasks,
    })

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
        errorOfTaskUpdate,
        isLoadingTaskUpdate,
        deleteTask,
        isLoadingTaskDelete,
        filterTasks,
        changeFilterType,
        filterType,
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
        return JSON.parse(JSON.stringify(result))
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
