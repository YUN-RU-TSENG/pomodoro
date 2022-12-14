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

    const firebaseRefUserTask = computed(() =>
        query(
            collection(db, 'tasks'),
            where('uid', '==', userStore.user.uid),
            orderBy('createAt')
        )
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
     * ?????? task
     */
    const getTasks = async () => {
        try {
            isLoadingTaskGet.value = true
            errorOfTaskGet.value = null

            const taskSnapshot = await getDocs(firebaseRefUserTask.value)
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
                text: '??????' + error.code,
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

    // ?????? task
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
                text: '??????' + error.code,
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
        return result
    })

    // ?????? task
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

            // ?????????????????????????????????????????? debounce update ???????????? function ??????????????????
            if (showError)
                useBaseAlert({
                    text: '??????' + error.code,
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
    // ?????????????????????????????? interval Id
    const timeIntervalId = ref(null)

    // ??? update task id ??????????????? interval Id
    watch(selectedUpdateTaskId, () => {
        if (timeIntervalId.value) clearTimeout(timeIntervalId.value)
        timeIntervalId.value = null
    })

    const updateTaskAndAutoResendUpdateFormOnError = async (formValue) => {
        await updateTask(formValue, false)

        // ??????????????????????????????????????????????????????????????????????????????????????? ???????????????????????? interval Id
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

    // ?????? task
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
                text: '??????' + error.code,
            })
        } finally {
            isLoadingTaskDelete.value = false
        }
    }

    return { deleteTask, isLoadingTaskDelete, errorOfTaskDelete }
}

function useSumOfTasksItem({ tasks }) {
    // ?????????????????????
    const theSumOfExpectTimeOfTask = computed(() => {
        return tasks.value
            .filter((item) => !item.isFinish && !!item.totalExpectTime)
            .reduce((acc, cur) => {
                return acc + cur.totalExpectTime
            }, 0)
    })

    // ?????????????????????
    const theSumOfSpendTimeOfTask = computed(() => {
        return tasks.value
            .filter((item) => !item.isFinish && !!item.totalSpendTime)
            .reduce((acc, cur) => {
                return acc + cur.totalSpendTime
            }, 0)
    })

    // ??????????????????
    const theSumOfNumberOfTasks = computed(() => {
        return tasks.value.length
    })

    // ???????????????????????????
    const theSumOfNumberOfUnFinishTasks = computed(() => {
        return tasks.value.filter((item) => !item.isFinish).length
    })

    // ????????????????????????
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
