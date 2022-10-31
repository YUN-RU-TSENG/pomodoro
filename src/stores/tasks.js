import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import { db } from '@/utils/firebaseStore'
import {
    orderBy,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    query,
    doc,
    where,
} from 'firebase/firestore'
import { useUserStore } from './user'
import { useDebounceFn } from '@vueuse/core'
import { useBaseAlert } from '@/components/Base/BaseAlert/index'

export const useTasksStore = defineStore('tasks', () => {
    // userStore
    const userStore = useUserStore()

    // firebaseTaskRef
    const { firebaseRefTask, firebaseRefUserTask } = useFirebaseTaskRef({
        userStore,
    })

    // tasks - get
    const { tasks, getTasks, isLoadingTaskGet, errorOfTaskGet } = useGetTasks({
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
    const { deleteTask, isLoadingTaskDelete, errorOfTaskDelete } =
        useDeleteTask({
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

    // tasks - sum of tasks item
    const {
        theSumOfExpectTimeOfTask,
        theSumOfSpendTimeOfTask,
        theSumOfNumberOfTasks,
        theSumOfNumberOfUnFinishTasks,
        theSumOfNumberOfFinishTasks,
    } = useSumOfTasksItem({ tasks })

    return {
        // tasks - get
        tasks,
        getTasks,
        isLoadingTaskGet,
        errorOfTaskGet,
        // tasks - add
        addTask,
        isLoadingTaskAdd,
        errorOfTaskAdd,
        // tasks - update
        selectedUpdateTaskId,
        selectedUpdateTask,
        updateTask,
        isLoadingTaskUpdate,
        errorOfTaskUpdate,
        // tasks - debounce update
        debouncedUpdateTaskAndAutoRetryOnError,
        // tasks - delete
        deleteTask,
        isLoadingTaskDelete,
        errorOfTaskDelete,
        // tasks - sum of tasks item
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
        where('uid', '==', userStore.user.uid),
        orderBy('createAt')
    )

    return {
        firebaseRefTask,
        firebaseRefUserTask,
    }
}

function useGetTasks({ firebaseRefUserTask }) {
    const tasks = ref([])
    const isLoadingTaskGet = ref(false)
    const errorOfTaskGet = ref(null)

    /**
     * 讀取 task
     */
    const getTasks = async () => {
        try {
            isLoadingTaskGet.value = true
            errorOfTaskGet.value = null

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
            errorOfTaskGet.value = error
            console.error(error)

            useBaseAlert({
                text: '錯誤' + error.code,
            })
        } finally {
            isLoadingTaskGet.value = false
        }
    }

    return {
        tasks,
        getTasks,
        isLoadingTaskGet,
        errorOfTaskGet,
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

            useBaseAlert({
                text: '錯誤' + error.code,
            })
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
    const updateTask = async (formValue, showError = true) => {
        try {
            errorOfTaskUpdate.value = null
            isLoadingTaskUpdate.value = true

            const currentEditTaskReference = doc(db, 'tasks', formValue.id)

            await updateDoc(currentEditTaskReference, formValue)

            getTasks()
        } catch (error) {
            errorOfTaskUpdate.value = error
            console.error(error)

            // 顯示錯誤，但要是可選的，因為 debounce update 時使用該 function不要顯示錯誤
            if (showError)
                useBaseAlert({
                    text: '錯誤' + error.code,
                })
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
    // 自動三秒後發送一次的 interval Id
    const timeIntervalId = ref(null)

    // 當 update task id 更新，刪除 interval Id
    watch(selectedUpdateTaskId, () => {
        if (timeIntervalId.value) clearTimeout(timeIntervalId.value)
        timeIntervalId.value = null
    })

    const updateTaskAndAutoResendUpdateFormOnError = async (formValue) => {
        await updateTask(formValue, false)

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
    const errorOfTaskDelete = ref(null)

    // 刪除 task
    const deleteTask = async (cacheDeleteTaskId) => {
        try {
            isLoadingTaskDelete.value = true
            errorOfTaskDelete.value = null

            const currentDocumentReference = doc(db, 'tasks', cacheDeleteTaskId)

            await deleteDoc(currentDocumentReference)
            selectedUpdateTaskId.value = ''

            getTasks()
        } catch (error) {
            console.error(error)
            errorOfTaskDelete.value = error

            useBaseAlert({
                text: '錯誤' + error.code,
            })
        } finally {
            isLoadingTaskDelete.value = false
        }
    }

    return { deleteTask, isLoadingTaskDelete, errorOfTaskDelete }
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
