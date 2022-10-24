import { defineStore } from 'pinia'
import { ref } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/utils/firebaseStore'
import { useUserStore } from '@/stores/user'

export const usePomorodoSetting = defineStore('pomorodoSetting', () => {
    // userStore
    const userStore = useUserStore()

    // pomorodoSettings
    const {
        pomorodoSettings,
        isLoadingPomorodoSettingGet,
        errorOfPomorodoSettingGet,
        getPomorodoSettingAndAutoCreateDefaultValue,
    } = useGetPomorodoSettings({ userStore })

    return {
        pomorodoSettings,
        isLoadingPomorodoSettingGet,
        errorOfPomorodoSettingGet,
        getPomorodoSettingAndAutoCreateDefaultValue,
    }
})

// pomorodoSettings 用戶番茄鐘相關設置（有預設值如下 initPomorodoSetting）
function useGetPomorodoSettings({ userStore }) {
    const pomorodoSettings = ref({})
    const isLoadingPomorodoSettingGet = ref(false)
    const errorOfPomorodoSettingGet = ref(null)

    // 取得 pomorodo setting，當沒有 pomorodo setting 時新增預設值 initPomorodoSetting
    const getPomorodoSettingAndAutoCreateDefaultValue = async () => {
        const initPomorodoSetting = {
            pomorodo: 45 * 60, // pomorodo 時長(秒)
            breakTime: 5 * 60, // breakTime 時長(秒)
            longBreakTime: 15 * 60, // longBreakTime 時長(秒)
            longBreakInterval: 4 * 60, // longBreakTime 間隔回數
            uid: userStore.user.uid,
            autoContinue: false, // 是否自動繼續 Pomorodo
        }

        try {
            errorOfPomorodoSettingGet.value = null
            isLoadingPomorodoSettingGet.value = true

            const docRef = doc(db, 'pomorodoSettings', userStore.user.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                pomorodoSettings.value = docSnap.data()
            } else {
                await setDoc(
                    doc(db, 'pomorodoSettings', userStore.user.uid),
                    initPomorodoSetting
                )

                pomorodoSettings.value = { ...initPomorodoSetting }
            }
        } catch (error) {
            console.error(error)
            errorOfPomorodoSettingGet.value = error
        } finally {
            isLoadingPomorodoSettingGet.value = false
        }
    }

    return {
        pomorodoSettings,
        isLoadingPomorodoSettingGet,
        errorOfPomorodoSettingGet,
        getPomorodoSettingAndAutoCreateDefaultValue,
    }
}
