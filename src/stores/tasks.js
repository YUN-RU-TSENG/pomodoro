import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
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
    serverTimestamp,
} from '@/utils/firebaseStore'
import { useUserStore } from './user'
import { useForm } from 'vee-validate'
import { string, object, number, boolean, array } from 'yup'

export const useTasksStore = defineStore('tasks', () => {
    // state ----

    // isLoading
    const isLoading = ref(false)

    // firebaseTaskRef
    const { firebaseRefTask, firebaseRefUserTask } = useFirebaseTaskRef()

    // tasks
    const { tasks, getTasks } = useGetTasks({ firebaseRefUserTask, isLoading })
    const { addTask, cacheAddForm, cacheAddFormErrorMessage } = useAddTask({
        firebaseRefTask,
        getTasks,
        isLoading,
    })
    const { cacheUpdateForm, cacheUpdateTaskId, updateTask } = useUpdateTask({
        isLoading,
        tasks,
        getTasks,
    })
    const { deleteTask } = useDeleteTask({ isLoading, getTasks })

    return {
        isTaskLoading: isLoading,
        firebaseRefTask,
        firebaseRefUserTask,
        tasks,
        getTasks,
        addTask,
        cacheAddForm,
        cacheAddFormErrorMessage,
        cacheUpdateForm,
        cacheUpdateTaskId,
        updateTask,
        deleteTask,
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

function useGetTasks({ firebaseRefUserTask, isLoading }) {
    const tasks = ref([])

    /**
     * 讀取 task
     */
    const getTasks = async () => {
        try {
            isLoading.value = true
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
            isLoading.value = false
        }
    }

    return {
        tasks,
        getTasks,
    }
}

function useAddTask({ firebaseRefTask, getTasks, isLoading }) {
    const userStore = useUserStore()

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
            tomatoTime: number(),
            totalExpectTime: number().integer(),
            subtasks: array(),
            createAt: '',
            expectEndDate: '',
        }),
        keepValuesOnUnmount: true,
        initialValues: {
            isFinish: false,
            name: '',
            description: '',
            tags: [],
            folder: '',
            totalSpendTime: 0,
            tomatoTime: 1000 * 60 * 60,
            totalExpectTime: 0,
            subtasks: [],
            createAt: null,
            expectEndDate: null,
        },
    })

    const [
        isFinish,
        name,
        description,
        tags,
        folder,
        totalSpendTime,
        tomatoTime,
        totalExpectTime,
        subtasks,
        createAt,
        expectEndDate,
    ] = useFieldModel([
        'isFinish',
        'name',
        'description',
        'tags',
        'folder',
        'totalSpendTime',
        'tomatoTime',
        'totalExpectTime',
        'subtasks',
        'createAt',
        'expectEndDate',
    ])

    const cacheAddForm = ref({
        isFinish,
        name,
        description,
        tags,
        folder,
        totalSpendTime,
        tomatoTime,
        totalExpectTime,
        subtasks,
        createAt,
        expectEndDate,
    })

    // 新增 task
    const addTask = handleSubmit(async () => {
        try {
            isLoading.value = true

            await addDoc(firebaseRefTask, {
                uid: userStore.user.uid,
                ...cacheAddForm.value,
                createAt: serverTimestamp(),
            })

            resetCacheAddForm()
            getTasks()
        } catch (error) {
            console.error(error)
        } finally {
            isLoading.value = true
        }
    })

    return {
        addTask,
        cacheAddForm,
        cacheAddFormErrorMessage,
        cacheAddFormMeta,
        cacheAddFormSubmitCount,
    }
}

function useUpdateTask({ isLoading, tasks, getTasks }) {
    const cacheUpdateTaskId = ref(null)

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
            isFinish: boolean().required(),
            name: string().trim().required(),
            description: string(),
            tags: array(),
            folder: string(),
            totalSpendTime: number().integer(),
            tomatoTime: number(),
            totalExpectTime: number().integer(),
            subtasks: array(),
            createAt: '',
            expectEndDate: '',
        }),
        keepValuesOnUnmount: true,
    })

    const [
        isFinish,
        name,
        description,
        tags,
        folder,
        totalSpendTime,
        tomatoTime,
        totalExpectTime,
        subtasks,
        createAt,
        expectEndDate,
    ] = useFieldModel([
        'isFinish',
        'name',
        'description',
        'tags',
        'folder',
        'totalSpendTime',
        'tomatoTime',
        'totalExpectTime',
        'subtasks',
        'createAt',
        'expectEndDate',
    ])

    const cacheUpdateForm = ref({
        isFinish,
        name,
        description,
        tags,
        folder,
        totalSpendTime,
        tomatoTime,
        totalExpectTime,
        subtasks,
        createAt,
        expectEndDate,
    })

    // 當 cacheUpdateTaskId 更新時，更新 cacheUpdateTask 表單
    watchEffect(() => {
        if (!cacheUpdateTaskId.value) return

        // 快取的 updateTask 不需要 id 屬性，故將其去除，該屬性並非 firebase doc 值，而是 doc key，是透過 format 而成
        const [result] = tasks.value
            .filter((task) => task.id === cacheUpdateTaskId.value)
            .slice()

        setUpdateFormValues(JSON.parse(JSON.stringify(result)))
    })

    // 更新 task
    const updateTask = handleSubmit(async () => {
        try {
            isLoading.value = true

            const currentEditTaskReference = doc(
                db,
                'tasks',
                cacheUpdateTaskId.value
            )

            // eslint-disable-next-line no-unused-vars
            const { id, ...updateTask } = cacheUpdateForm.value

            await updateDoc(currentEditTaskReference, {
                ...updateTask,
            })

            getTasks()
        } catch (error) {
            console.error(error)
        } finally {
            isLoading.value = true
        }
    })

    // 自動儲存
    // 監聽 cacheUpdateForm 一但變動就存到 localStorage，當沒有失敗的情況下，更新到遠端 (使用 debounce 包裹防止過多請求)，一但請求失敗則會顯示錯誤，並且自動重複更新到遠端直到成功
    watchEffect(
        handleSubmit(() => {
            // 監聽 cacheUpdateForm 一但變動就存到 localStorage
            // 是否有失敗的情況下
            // 否，更新到遠端 (使用 debounce 包裹防止過多請求)
            // 是，一但請求失敗則會顯示錯誤，並且自動重複更新到遠端直到成功
        })
    )

    return {
        cacheUpdateForm,
        cacheUpdateTaskId,
        updateTask,
        resetCacheUpdateForm,
        cacheUpdateFormErrorMessage,
        cacheUpdateFormMeta,
        cacheUpdateFormSubmitCount,
    }
}

function useDeleteTask({ isLoading, getTasks }) {
    // 刪除 task
    const deleteTask = async (cacheDeleteTaskId) => {
        try {
            isLoading.value = true

            const currentDocumentReference = doc(db, 'tasks', cacheDeleteTaskId)

            await deleteDoc(currentDocumentReference)

            getTasks()
        } catch (error) {
            console.error(error)
        } finally {
            isLoading.value = true
        }
    }

    return { deleteTask }
}
