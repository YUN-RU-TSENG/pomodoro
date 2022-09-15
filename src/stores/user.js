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
    // router ---
    const router = useRouter()

    // state ----

    // 加載中
    const isLoading = ref(false)

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

    return {
        user,
        userForm,
        userFormErrorMessage,
        userFormSubmitCount,
        userFormMeta,
        login,
        register,
        logout,
        resetUserForm,
        isLoading,
    }
})
