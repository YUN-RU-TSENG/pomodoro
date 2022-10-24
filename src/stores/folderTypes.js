import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore'
import { db } from '@/utils/firebaseStore'
import { useUserStore } from '@/stores/user'
import dayjs from 'dayjs'

export const useFolderTypesStore = defineStore('folderTypes', () => {
    // userStore
    const userStore = useUserStore()

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
