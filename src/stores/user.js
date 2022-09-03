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

export const useUserStore = defineStore('user', () => {
    // state ----

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
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userForm.value.email,
                userForm.value.password
            )

            user.value = {
                email: userCredential.user.email,
                uid: userCredential.user.uid,
            }
        } catch (error) {
            useBaseAlert({
                text: '註冊失敗' + error,
            })
        }
    })

    /**
     * 登入
     */
    const login = handleUserFormSubmit(async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                userForm.value.email,
                userForm.value.password
            )

            user.value = {
                email: userCredential.user.email,
                uid: userCredential.user.uid,
            }
        } catch (error) {
            useBaseAlert({
                text: '登入失敗 - ' + error.message,
            })
        }
    })

    /**
     * 登出
     */
    const logout = async () => {
        try {
            await signOut(auth)

            resetUserState()
        } catch (error) {
            useBaseAlert({
                text: '登出失敗' + error,
            })
        }
    }

    /**
     * 監聽用戶 Auth 狀態
     */
    const watchUserAuthState = () => {
        // 返回 promise
        return new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged(function (userData) {
                resolve({
                    // 用戶資料
                    user: { email: userData.email, uid: userData.uid },
                    // 取消監聽用戶 Auth 狀態
                    cancelWatchUserAuthState: unsubscribe,
                })
            })
        })
    }

    /**
     * 確認用戶當前 Auth 狀態
     * 由於 firebase 沒有取得一次 Auth 狀態的 methods，所以使用 onAuthStateChanged 方法，在取得用戶 Auth 後便取消監聽
     */
    //
    const checkUserAuthState = async () => {
        const { user: userData, cancelWatchUserAuthState } =
            await watchUserAuthState()

        user.value = userData

        // 取消監聽用戶 Auth 狀態
        cancelWatchUserAuthState()
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
        checkUserAuthState,
        resetUserForm,
    }
})
