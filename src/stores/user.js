import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    auth,
} from '@/utils/firebaseAuth'
import { useBaseAlert } from '@/components/Base/BaseAlert/index'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
    const router = useRouter()

    // state ----

    const isLoadingForFirstWatchingUserState = ref(false) // 對應初次監聽用戶登入狀態的加載

    // 用戶資料
    const user = ref({
        email: null,
        uid: null,
    })

    // 註冊
    const { isLoadingRegister, register, errorOfRegister } = useRegister({
        user,
        router,
    })

    // 登入
    const { isLoadingLogin, login, errorOfLogin } = useLogin({ user, router })

    // 登出
    const { isLoadingLogout, logout, errorOfLogout } = useLogout({
        user,
        router,
    })

    /**
     * 觀察用戶登入狀態，當有登入時就跳到 home 頁面，沒有登入時就跳到 login 頁面
     * 需要注意此處的加載狀態為 isLoadingForFirstWatchingUserState，這是為了與對應 loading、register、logout 的 isLoading 區隔
     */
    // const watchUserState = () => {
    //     isLoadingForFirstWatchingUserState.value = true
    //     auth.onAuthStateChanged(async function (userData) {
    //         if (userData) {
    //             user.value = { email: userData.email, uid: userData.uid }
    //             await router.push({ name: 'home' }).catch(() => {})
    //         } else {
    //             await router.push({ name: 'login' }).catch(() => {})
    //         }

    //         if (isLoadingForFirstWatchingUserState.value)
    //             isLoadingForFirstWatchingUserState.value = false
    //     })
    // }

    return {
        user,
        // register
        register,
        isLoadingRegister,
        errorOfRegister,
        // login
        login,
        isLoadingLogin,
        errorOfLogin,
        // logout
        logout,
        isLoadingLogout,
        errorOfLogout,
        isLoadingForFirstWatchingUserState,
    }
})

// 註冊
function useRegister({ user, router }) {
    const isLoadingRegister = ref(false)
    const errorOfRegister = ref(null)

    const register = async (formValue) => {
        try {
            isLoadingRegister.value = true

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formValue.email,
                formValue.password
            )

            user.value = {
                email: userCredential.user.email,
                uid: userCredential.user.uid,
            }

            router.push({ name: 'home' })
        } catch (error) {
            console.error(error)
            errorOfRegister.value = error
            useBaseAlert({
                text: '註冊失敗' + error,
            })
        } finally {
            isLoadingRegister.value = false
        }
    }

    return { isLoadingRegister, register, errorOfRegister }
}

// 登入
function useLogin({ user, router }) {
    const isLoadingLogin = ref(false)
    const errorOfLogin = ref(null)

    const login = async (formValue) => {
        try {
            isLoadingLogin.value = true

            const userCredential = await signInWithEmailAndPassword(
                auth,
                formValue.email,
                formValue.password
            )

            user.value = {
                email: userCredential.user.email,
                uid: userCredential.user.uid,
            }

            router.push({ name: 'home' })
        } catch (error) {
            errorOfLogin.value = error
            console.error(error)
            useBaseAlert({
                text: '登入失敗 - ' + error.message,
            })
        } finally {
            isLoadingLogin.value = false
        }
    }

    return { isLoadingLogin, login, errorOfLogin }
}

// 登出
function useLogout({ user, router }) {
    const isLoadingLogout = ref(false)
    const errorOfLogout = ref(null)

    const logout = async () => {
        try {
            isLoadingLogout.value = true

            await signOut(auth)

            user.value = {
                email: null,
                uid: null,
            }

            router.push({ name: 'login' })
        } catch (error) {
            errorOfLogout.value = error
            console.error(error)
            useBaseAlert({
                text: '登出失敗' + error,
            })
        } finally {
            isLoadingLogout.value = false
        }
    }

    return { isLoadingLogout, logout, errorOfLogout }
}
