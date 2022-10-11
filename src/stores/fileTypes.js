import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    collection,
    getDocs,
    addDoc,
    query,
    where,
    db,
    serverTimestamp,
} from '@/utils/firebaseStore'
import { useUserStore } from '@/stores/user'
import { useTasksStore } from '@/stores/tasks'

export const useFileTypesStore = defineStore('fileTypes', () => {
    // userStore
    const userStore = useUserStore()
    const tasksStore = useTasksStore()

    // firebaseFileTypesRef
    const { firebaseRefFileType, firebaseRefUserFileType } =
        useFirebaseFileTypeRef({ userStore })

    // fileTypes
    const { fileTypes, getFileTypes, isLoadingFileTypesGet } = useGetFileTypes({
        userStore,
        firebaseRefUserFileType,
    })
    const { addFileType, isLoadingFileTypesAdd } = useAddFileType({
        firebaseRefFileType,
        userStore,
        getFileTypes,
    })

    // fileTypes and Tasks
    const { eachFileTypeTotalTaskTime } = useFileTypeTotalTimes({
        tasksStore,
        fileTypes,
    })

    const updateFileType = () => {}

    const deleteFileType = () => {}

    return {
        fileTypes,
        getFileTypes,
        isLoadingFileTypesGet,
        isLoadingFileTypesAdd,
        addFileType,
        updateFileType,
        deleteFileType,
        eachFileTypeTotalTaskTime,
    }
})

function useFirebaseFileTypeRef({ userStore }) {
    const firebaseRefFileType = collection(db, 'fileTypes')

    const firebaseRefUserFileType = query(
        collection(db, 'fileTypes'),
        where('uid', '==', userStore.user.uid)
    )

    return { firebaseRefFileType, firebaseRefUserFileType }
}

function useGetFileTypes({ firebaseRefUserFileType }) {
    const fileTypes = ref([])
    const isLoadingFileTypesGet = ref(false)

    const getFileTypes = async () => {
        try {
            isLoadingFileTypesGet.value = true
            const fileTypeSnapshot = await getDocs(firebaseRefUserFileType)
            const fileTypesSnapshotData = []

            fileTypeSnapshot.forEach((fileTypeSnapshotData) => {
                fileTypesSnapshotData.push({
                    ...fileTypeSnapshotData.data(),
                    id: fileTypeSnapshotData.id,
                })
            })

            fileTypes.value = fileTypesSnapshotData
        } catch (error) {
            console.error(error)
        } finally {
            isLoadingFileTypesGet.value = false
        }
    }

    return {
        fileTypes,
        getFileTypes,
        isLoadingFileTypesGet,
    }
}

function useAddFileType({ firebaseRefFileType, userStore, getFileTypes }) {
    const isLoadingFileTypesAdd = ref(false)

    const addFileType = async (value) => {
        try {
            isLoadingFileTypesAdd.value = true
            await addDoc(firebaseRefFileType, {
                uid: userStore.user.uid,
                ...value,
                createAt: serverTimestamp(),
            })

            getFileTypes()
        } catch (error) {
            console.error(error)
        } finally {
            isLoadingFileTypesAdd.value = false
        }
    }

    return {
        addFileType,
        isLoadingFileTypesAdd,
    }
}

function useFileTypeTotalTimes({ tasksStore, fileTypes }) {
    // 將 fileType 以及 tasks 合併成 [{file:'name',totalTasks:12,time: millisecond}]
    const eachFileTypeTotalTaskTime = computed(() => {
        return fileTypes.value.reduce((acc, cur) => {
            const result = { file: '', totalTasks: 0, time: 0 }

            const currentTask = tasksStore.tasks.filter(
                (item) => item.folder === cur.file
            )

            result.id = cur.id
            result.file = cur.file
            result.totalTasks = currentTask.length
            result.time = currentTask.reduce((acc, cur) => {
                return acc + cur.totalExpectTime
            }, 0)

            return [...acc, result]
        }, [])
    })

    return {
        eachFileTypeTotalTaskTime,
    }
}
