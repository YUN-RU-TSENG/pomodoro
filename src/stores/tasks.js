import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    collection,
    getDocs,
    addDoc,
    // deleteDoc,
    // updateDoc,
    query,
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
    const { addTask, cacheAddTaskForm, cacheAddTaskFormErrorMessage } =
        useAddTask({
            firebaseRefTask,
            getTasks,
            isLoading,
        })

    return {
        isTaskLoading: isLoading,
        firebaseRefTask,
        firebaseRefUserTask,
        tasks,
        getTasks,
        addTask,
        cacheAddTaskForm,
        cacheAddTaskFormErrorMessage,
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
                tasksSnapshotData.push(taskSnapshotData.data())
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
        resetForm: resetCacheAddTaskForm,
        errors: cacheAddTaskFormErrorMessage,
        useFieldModel,
        meta: cacheAddTaskFormMeta,
        submitCount: cacheAddTaskFormSubmitCount,
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

    const cacheAddTaskForm = ref({
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
                ...cacheAddTaskForm.value,
                createAt: serverTimestamp(),
            })

            resetCacheAddTaskForm()
            getTasks()
        } catch (error) {
            console.error(error)
        } finally {
            isLoading.value = true
        }
    })

    return {
        addTask,
        cacheAddTaskForm,
        cacheAddTaskFormErrorMessage,
        cacheAddTaskFormMeta,
        cacheAddTaskFormSubmitCount,
    }
}

// function useUpdateTask({ isLoading }) {
//     const cacheUpdateTask = ref({})
//     const cacheUpdateTaskId = ref()

//     // 修改 task
//     const updateTask = () => {
//         try {
//         } catch (error) {}
//     }

//     return { cacheUpdateTask, cacheUpdateTaskId, updateTask }
// }

// function useDeleteTask({ isLoading }) {
//     const cacheDeleteTaskId = ref()

//     // 刪除 task
//     const deleteTask = () => {
//         try {
//         } catch (error) {}
//     }

//     return { cacheDeleteTaskId, useDeleteTask }
// }
