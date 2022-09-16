import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    auth,
} from '@/utils/firebaseAuth'
import { useForm } from 'vee-validate'
import { string, object } from 'yup'
import { useBaseAlert } from '@/components/Base/BaseAlert/index'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
    const router = useRouter()

    // state ----

    // 加載中
    const isLoading = ref(false) // 對應登入、登出、註冊時加載
    const isLoadingForFirstWatchingUserState = ref(false) // 對應初次監聽用戶登入狀態的加載

    // 用戶資料
    const user = ref({
        email: null,
        uid: null,
    })

    // 用戶登入註冊表單 - vee validate 表單值、錯誤、處理驗證
    const {
        handleSubmit: handleUserFormSubmit,
        resetForm: resetUserForm,
        errors: userFormErrorMessage,
        useFieldModel: useUserFormFieldModel,
        meta: userFormMeta,
        submitCount: userFormSubmitCount,
    } = useForm({
        validationSchema: object({
            email: string().email().required(),
            password: string().min(6).required(),
        }),
        keepValuesOnUnmount: true,
    })

    const [userFormEmail, userFormPassword] = useUserFormFieldModel([
        'email',
        'password',
    ])

    // 用戶登入註冊表單 - 表單
    const userForm = ref({
        email: userFormEmail,
        password: userFormPassword,
    })

    // action ----

    /**
     * 註冊
     */
    const register = handleUserFormSubmit(async () => {
        try {
            isLoading.value = true

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userForm.value.email,
                userForm.value.password
            )
            resetUserForm()

            user.value = {
                email: userCredential.user.email,
                uid: userCredential.user.uid,
            }

            router.push({ name: 'home' })
        } catch (error) {
            useBaseAlert({
                text: '註冊失敗' + error,
            })
        } finally {
            isLoading.value = false
        }
    })

    /**
     * 登入
     */
    const login = handleUserFormSubmit(async () => {
        try {
            isLoading.value = true

            const userCredential = await signInWithEmailAndPassword(
                auth,
                userForm.value.email,
                userForm.value.password
            )

            resetUserForm()

            user.value = {
                email: userCredential.user.email,
                uid: userCredential.user.uid,
            }

            router.push({ name: 'home' })
        } catch (error) {
            useBaseAlert({
                text: '登入失敗 - ' + error.message,
            })
        } finally {
            isLoading.value = false
        }
    })

    /**
     * 登出
     */
    const logout = async () => {
        try {
            isLoading.value = true

            await signOut(auth)

            resetUserState()

            router.push({ name: 'login' })
        } catch (error) {
            useBaseAlert({
                text: '登出失敗' + error,
            })
        } finally {
            isLoading.value = false
        }
    }

    /**
     * 重置 user 狀態
     */
    const resetUserState = () => {
        user.value = {
            email: null,
            uid: null,
        }
    }

    /**
     * 觀察用戶登入狀態，當有登入時就跳到 home 頁面，沒有登入時就跳到 login 頁面
     * 需要注意此處的加載狀態為 isLoadingForFirstWatchingUserState，這是為了與對應 loading、register、logout 的 isLoading 區隔
     */
    const watchUserState = () => {
        isLoadingForFirstWatchingUserState.value = true
        auth.onAuthStateChanged(async function (userData) {
            if (userData) {
                user.value = { email: userData.email, uid: userData.uid }
                await router.push({ name: 'home' }).catch(() => {})
            } else {
                await router.push({ name: 'login' }).catch(() => {})
            }

            if (isLoadingForFirstWatchingUserState.value)
                isLoadingForFirstWatchingUserState.value = false
        })
    }

    return {
        user,
        userForm,
        userFormErrorMessage,
        userFormSubmitCount,
        userFormMeta,
        login,
        register,
        logout,
        watchUserState,
        resetUserForm,
        isLoading,
    }
})
