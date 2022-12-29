import { defineStore } from 'pinia'
import { ref } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/utils/firebaseStore'
import { useUserStore } from '@/stores/user'
import { useBaseModal } from '@/components/Base/BaseModal/index'
import { useBaseAlert } from '@/components/Base/BaseAlert/index'

export const usePomodoroSetting = defineStore('pomodoroSetting', () => {
    // userStore
    const userStore = useUserStore()

    // pomodoroSettings - get
    const {
        pomodoroSettings,
        isLoadingPomodoroSettingGet,
        errorOfPomodoroSettingGet,
        getPomodoroSettingAndAutoCreateDefaultValue,
    } = useGetPomodoroSettings({ userStore })

    // pomodoroSettings - update
    const {
        updatePomodoroSettings,
        isLoadingPomodoroSettingsUpdate,
        errorOfPomodoroSettingsUpdate,
    } = useUpdatePomodoroSettings({
        userStore,
        pomodoroSettings,
    })

    return {
        pomodoroSettings,
        // pomodoroSettings - get
        isLoadingPomodoroSettingGet,
        errorOfPomodoroSettingGet,
        getPomodoroSettingAndAutoCreateDefaultValue,
        // pomodoroSettings - update
        updatePomodoroSettings,
        isLoadingPomodoroSettingsUpdate,
        errorOfPomodoroSettingsUpdate,
    }
})

// pomodoroSettings 用戶番茄鐘相關設置（有預設值如下 initPomodoroSetting）
function useGetPomodoroSettings({ userStore }) {
    const pomodoroSettings = ref({})
    const isLoadingPomodoroSettingGet = ref(false)
    const errorOfPomodoroSettingGet = ref(null)

    // 取得 pomodoro setting，當沒有 pomodoro setting 時新增預設值 initPomodoroSetting
    const getPomodoroSettingAndAutoCreateDefaultValue = async () => {
        const initPomodoroSetting = {
            pomodoro: 45 * 60, // pomodoro 時長(秒)
            breakTime: 5 * 60, // breakTime 時長(秒)
            longBreakTime: 15 * 60, // longBreakTime 時長(秒)
            longBreakInterval: 4, // longBreakTime 間隔回數
            uid: userStore.user.uid,
            autoContinue: false, // 是否自動繼續 Pomodoro
        }

        try {
            errorOfPomodoroSettingGet.value = null
            isLoadingPomodoroSettingGet.value = true

            const docRef = doc(db, 'pomodoroSettings', userStore.user.uid)

            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                pomodoroSettings.value = docSnap.data()
            } else {
                await setDoc(
                    doc(db, 'pomodoroSettings', userStore.user.uid),
                    initPomodoroSetting
                )

                pomodoroSettings.value = { ...initPomodoroSetting }
            }
        } catch (error) {
            console.error(error)
            errorOfPomodoroSettingGet.value = error

            useBaseModal(null, {
                header: '初始錯誤',
                body: '加載用戶設置錯誤，請重新載入',
                footer: '',
            })
        } finally {
            isLoadingPomodoroSettingGet.value = false
        }
    }

    return {
        pomodoroSettings,
        isLoadingPomodoroSettingGet,
        errorOfPomodoroSettingGet,
        getPomodoroSettingAndAutoCreateDefaultValue,
    }
}

function useUpdatePomodoroSettings({ userStore, pomodoroSettings }) {
    const isLoadingPomodoroSettingsUpdate = ref(false)
    const errorOfPomodoroSettingsUpdate = ref(null)

    const updatePomodoroSettings = async (data) => {
        try {
            isLoadingPomodoroSettingsUpdate.value = true
            errorOfPomodoroSettingsUpdate.value = null

            await setDoc(doc(db, 'pomodoroSettings', userStore.user.uid), {
                uid: pomodoroSettings.value.uid,
                ...data,
            })

            const docSnap = await getDoc(
                doc(db, 'pomodoroSettings', userStore.user.uid)
            )
            pomodoroSettings.value = docSnap.data()
        } catch (error) {
            console.log({
                uid: pomodoroSettings,
                ...data,
            })
            console.error(error)
            errorOfPomodoroSettingsUpdate.value = error

            useBaseAlert({
                text: '錯誤' + error.code,
            })
        } finally {
            isLoadingPomodoroSettingsUpdate.value = false
        }
    }
    return {
        updatePomodoroSettings,
        isLoadingPomodoroSettingsUpdate,
        errorOfPomodoroSettingsUpdate,
    }
}
