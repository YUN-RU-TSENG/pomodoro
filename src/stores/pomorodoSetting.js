import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db, doc, getDoc, setDoc } from '@/utils/firebaseStore'
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

// pomorodoSettings
function useGetPomorodoSettings({ userStore }) {
    const pomorodoSettings = ref({})
    const isLoadingPomorodoSettingGet = ref(false)
    const errorOfPomorodoSettingGet = ref(null)

    // 取得 pomorodo setting，當沒有 pomorodo setting 時新增預設值 initPomorodoSetting
    const getPomorodoSettingAndAutoCreateDefaultValue = async () => {
        const initPomorodoSetting = {
            pomorodo: 25 * 60, // pomorodo 時長(秒)
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
                return
            }

            await setDoc(
                doc(db, 'pomorodoSettings', userStore.user.uid),
                initPomorodoSetting
            )

            pomorodoSettings.value = initPomorodoSetting
        } catch (error) {
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
