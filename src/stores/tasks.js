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
import { watchDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { string, object, number, boolean, array } from 'yup'
import dayjs from 'dayjs'

export const useTasksStore = defineStore('tasks', () => {
    // firebaseTaskRef
    const { firebaseRefTask, firebaseRefUserTask } = useFirebaseTaskRef()

    // tasks
    const { tasks, getTasks, isLoadingTaskGet } = useGetTasks({
        firebaseRefUserTask,
    })
    const {
        addTask,
        isLoadingTaskAdd,
        cacheAddForm,
        cacheAddFormErrorMessage,
    } = useAddTask({
        firebaseRefTask,
        getTasks,
    })
    const {
        cacheUpdateTaskId,
        cacheUpdateForm,
        updateTask,
        isLoadingTaskUpdate,
        setUpdateFormValues,
        clearCacheUpdateTaskId,
    } = useUpdateTask({
        tasks,
        getTasks,
    })
    const { deleteTask, isLoadingTaskDelete } = useDeleteTask({
        getTasks,
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
        cacheAddForm,
        cacheAddFormErrorMessage,
        cacheUpdateForm,
        cacheUpdateTaskId,
        setUpdateFormValues,
        clearCacheUpdateTaskId,
        updateTask,
        isLoadingTaskUpdate,
        deleteTask,
        isLoadingTaskDelete,
        filterTasks,
        changeFilterType,
        filterType,
    }
})

function useFirebaseTaskRef() {
    const userStore = useUserStore()

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

function useAddTask({ firebaseRefTask, getTasks }) {
    const userStore = useUserStore()
    const isLoadingTaskAdd = ref(false)

    const {
        handleSubmit,
        resetForm: resetCacheAddForm,
        errors: cacheAddFormErrorMessage,
        useFieldModel,
        meta: cacheAddFormMeta,
        submitCount: cacheAddFormSubmitCount,
    } = useForm({
        validationSchema: object({
            isFinish: boolean().required(),
            name: string().trim().required(),
            description: string(),
            tags: array(),
            folder: string(),
            totalSpendTime: number().integer(),
            pomorodoTime: number(),
            totalExpectTime: number().integer(),
            subtasks: array(),
            createAt: '',
            expectEndDate: '',
            mentionDate: '',
        }),
        keepValuesOnUnmount: true,
        initialValues: {
            isFinish: false,
            name: '',
            description: '',
            tags: [],
            folder: '',
            totalSpendTime: 0,
            pomorodoTime: 1000 * 60 * 60,
            totalExpectTime: 0,
            subtasks: [],
            createAt: null,
            expectEndDate: null,
            mentionDate: null,
        },
    })

    const [
        isFinish,
        name,
        description,
        tags,
        folder,
        totalSpendTime,
        pomorodoTime,
        totalExpectTime,
        subtasks,
        createAt,
        expectEndDate,
        mentionDate,
    ] = useFieldModel([
        'isFinish',
        'name',
        'description',
        'tags',
        'folder',
        'totalSpendTime',
        'pomorodoTime',
        'totalExpectTime',
        'subtasks',
        'createAt',
        'expectEndDate',
        'mentionDate',
    ])

    const cacheAddForm = ref({
        isFinish,
        name,
        description,
        tags,
        folder,
        totalSpendTime,
        pomorodoTime,
        totalExpectTime,
        subtasks,
        createAt,
        expectEndDate,
        mentionDate,
    })

    // 新增 task
    const addTask = handleSubmit(async () => {
        try {
            isLoadingTaskAdd.value = true

            await addDoc(firebaseRefTask, {
                uid: userStore.user.uid,
                ...cacheAddForm.value,
                createAt: dayjs().toISOString(),
            })

            resetCacheAddForm()
            getTasks()
        } catch (error) {
            console.error(error)
        } finally {
            isLoadingTaskAdd.value = true
        }
    })

    return {
        addTask,
        cacheAddForm,
        cacheAddFormErrorMessage,
        cacheAddFormMeta,
        cacheAddFormSubmitCount,
        isLoadingTaskAdd,
    }
}

function useUpdateTask({ tasks, getTasks }) {
    const cacheUpdateTaskId = ref('')
    const isLoadingTaskUpdate = ref(false)

    const {
        handleSubmit,
        resetForm: resetCacheUpdateForm,
        errors: cacheUpdateFormErrorMessage,
        useFieldModel,
        meta: cacheUpdateFormMeta,
        submitCount: cacheUpdateFormSubmitCount,
        setValues: setUpdateFormValues,
    } = useForm({
        validationSchema: object({
            id: string().trim().required(),
            isFinish: boolean().required(),
            name: string().trim().required(),
            description: string(),
            tags: array(),
            folder: string(),
            totalSpendTime: number().integer(),
            pomorodoTime: number(),
            totalExpectTime: number().integer(),
            subtasks: array(),
            createAt: '',
            expectEndDate: '',
            mentionDate: '',
        }),
        keepValuesOnUnmount: true,
    })

    const [
        id,
        isFinish,
        name,
        description,
        tags,
        folder,
        totalSpendTime,
        pomorodoTime,
        totalExpectTime,
        subtasks,
        createAt,
        expectEndDate,
        mentionDate,
    ] = useFieldModel([
        'id',
        'isFinish',
        'name',
        'description',
        'tags',
        'folder',
        'totalSpendTime',
        'pomorodoTime',
        'totalExpectTime',
        'subtasks',
        'createAt',
        'expectEndDate',
        'mentionDate',
    ])

    const cacheUpdateForm = ref({
        id,
        isFinish,
        name,
        description,
        tags,
        folder,
        totalSpendTime,
        pomorodoTime,
        totalExpectTime,
        subtasks,
        createAt,
        expectEndDate,
        mentionDate,
    })

    // 依照快取 id 自 tasks 中取得 task
    function getTaskByCacheUpdateTaskId() {
        return tasks.value
            .filter((task) => task.id === cacheUpdateTaskId.value)
            .slice()
    }

    // 當 cacheUpdateTaskId 更新時，更新 cacheUpdateTask 表單
    watch(cacheUpdateTaskId, () => {
        // 當 cacheUpdateTaskId 更新時，表單會依照 cacheUpdateTaskId 更動，首先我們先重置目前表單
        resetCacheUpdateForm()

        if (!cacheUpdateTaskId.value) return

        const [result] = getTaskByCacheUpdateTaskId()

        setUpdateFormValues(JSON.parse(JSON.stringify(result)))
    })

    // 清除 cache update task id
    const clearCacheUpdateTaskId = () => {
        cacheUpdateTaskId.value = null
    }

    // 更新 task
    const updateTask = handleSubmit(
        async () => {
            try {
                // 由於每當 cacheUpdateTaskId 更動表單就會更新，這樣在只是切換表單 id 時也會送出更新，這不是我們需要的效果，在這裏只有在二次更新時表單有真正的變動，此時才會送出更新
                if (cacheUpdateFormSubmitCount.value <= 1) return

                isLoadingTaskUpdate.value = true

                const currentEditTaskReference = doc(
                    db,
                    'tasks',
                    cacheUpdateTaskId.value
                )

                // 此行刪除不需要的 id，id 是自 firebase doc format 來的屬性
                // eslint-disable-next-line no-unused-vars
                const { id, ...updateTask } = cacheUpdateForm.value

                await updateDoc(currentEditTaskReference, updateTask)

                getTasks()
            } catch (error) {
                console.error(error)
            } finally {
                isLoadingTaskUpdate.value = false
            }
        },
        (e) => {
            console.error(e)
        }
    )

    // 自動儲存
    // 監聽 cacheUpdateForm 一但變動就更新到遠端 (使用 debounce 包裹防止過多請求)，一但請求失敗則會顯示錯誤，並且自動重複更新到遠端直到成功
    watchDebounced(cacheUpdateForm.value, updateTask, {
        debounce: 500,
        maxWait: 1000,
    })

    return {
        cacheUpdateForm,
        cacheUpdateTaskId,
        updateTask,
        setUpdateFormValues,
        resetCacheUpdateForm,
        cacheUpdateFormErrorMessage,
        cacheUpdateFormMeta,
        cacheUpdateFormSubmitCount,
        clearCacheUpdateTaskId,
        isLoadingTaskUpdate,
    }
}

function useDeleteTask({ getTasks }) {
    const isLoadingTaskDelete = ref(false)

    // 刪除 task
    const deleteTask = async (cacheDeleteTaskId) => {
        try {
            isLoadingTaskDelete.value = true

            const currentDocumentReference = doc(db, 'tasks', cacheDeleteTaskId)

            await deleteDoc(currentDocumentReference)

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
