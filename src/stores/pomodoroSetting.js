import { defineStore } from 'pinia'
import { ref } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/utils/firebaseStore'
import { useUserStore } from '@/stores/user'
import { useBaseModal } from '@/components/Base/BaseModal/index'

export const usePomodoroSetting = defineStore('pomodoroSetting', () => {
    // userStore
    const userStore = useUserStore()

    // pomodoroSettings
    const {
        pomodoroSettings,
        isLoadingPomodoroSettingGet,
        errorOfPomodoroSettingGet,
        getPomodoroSettingAndAutoCreateDefaultValue,
    } = useGetPomodoroSettings({ userStore })

    // 載入該 store 後便同時加載用戶初始設置
    getPomodoroSettingAndAutoCreateDefaultValue()

    return {
        pomodoroSettings,
        isLoadingPomodoroSettingGet,
        errorOfPomodoroSettingGet,
        getPomodoroSettingAndAutoCreateDefaultValue,
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
