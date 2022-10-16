import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    collection,
    getDocs,
    addDoc,
    query,
    where,
    db,
} from '@/utils/firebaseStore'
import { useUserStore } from '@/stores/user'
import { useTasksStore } from '@/stores/tasks'
import dayjs from 'dayjs'

export const useFolderTypesStore = defineStore('folderTypes', () => {
    // userStore
    const userStore = useUserStore()
    const tasksStore = useTasksStore()

    // firebaseFolderTypesRef
    const { firebaseRefFolderType, firebaseRefUserFolderType } =
        useFirebaseFolderTypeRef({ userStore })

    // folderTypes
    const { folderTypes, getFolderTypes, isLoadingFolderTypesGet } =
        useGetFolderTypes({
            userStore,
            firebaseRefUserFolderType,
        })
    const { addFolderType, isLoadingFolderTypesAdd } = useAddFolderType({
        firebaseRefFolderType,
        userStore,
        getFolderTypes,
    })

    // folderTypes and Tasks
    const { eachFolderTypeTotalTaskTime } = useFolderTypeTotalTimes({
        tasksStore,
        folderTypes,
    })

    const updateFolderType = () => {}

    const deleteFolderType = () => {}

    return {
        folderTypes,
        getFolderTypes,
        isLoadingFolderTypesGet,
        isLoadingFolderTypesAdd,
        addFolderType,
        updateFolderType,
        deleteFolderType,
        eachFolderTypeTotalTaskTime,
    }
})

function useFirebaseFolderTypeRef({ userStore }) {
    const firebaseRefFolderType = collection(db, 'folderTypes')

    const firebaseRefUserFolderType = query(
        collection(db, 'folderTypes'),
        where('uid', '==', userStore.user.uid)
    )

    return { firebaseRefFolderType, firebaseRefUserFolderType }
}

function useGetFolderTypes({ firebaseRefUserFolderType }) {
    const folderTypes = ref([])
    const isLoadingFolderTypesGet = ref(false)

    const getFolderTypes = async () => {
        try {
            isLoadingFolderTypesGet.value = true
            const folderTypeSnapshot = await getDocs(firebaseRefUserFolderType)
            const folderTypesSnapshotData = []

            folderTypeSnapshot.forEach((folderTypeSnapshotData) => {
                folderTypesSnapshotData.push({
                    ...folderTypeSnapshotData.data(),
                    id: folderTypeSnapshotData.id,
                })
            })

            folderTypes.value = folderTypesSnapshotData
        } catch (error) {
            console.error(error)
        } finally {
            isLoadingFolderTypesGet.value = false
        }
    }

    return {
        folderTypes,
        getFolderTypes,
        isLoadingFolderTypesGet,
    }
}

function useAddFolderType({
    firebaseRefFolderType,
    userStore,
    getFolderTypes,
}) {
    const isLoadingFolderTypesAdd = ref(false)

    const addFolderType = async (value) => {
        try {
            isLoadingFolderTypesAdd.value = true
            await addDoc(firebaseRefFolderType, {
                uid: userStore.user.uid,
                ...value,
                createAt: dayjs().toISOString(),
            })

            getFolderTypes()
        } catch (error) {
            console.error(error)
        } finally {
            isLoadingFolderTypesAdd.value = false
        }
    }

    return {
        addFolderType,
        isLoadingFolderTypesAdd,
    }
}

function useFolderTypeTotalTimes({ tasksStore, folderTypes }) {
    // 將 folderType 以及 tasks 合併成 [{name:'name',totalTasks:12,time: millisecond}]
    const eachFolderTypeTotalTaskTime = computed(() => {
        return folderTypes.value.reduce((acc, cur) => {
            const result = { name: '', totalTasks: 0, time: 0 }

            const currentTask = tasksStore.tasks.filter(
                (item) => item.folder === cur.name
            )

            result.id = cur.id
            result.name = cur.name
            result.totalTasks = currentTask.length
            result.time = currentTask.reduce((acc, cur) => {
                return acc + cur.totalExpectTime
            }, 0)

            return [...acc, result]
        }, [])
    })

    return {
        eachFolderTypeTotalTaskTime,
    }
}
