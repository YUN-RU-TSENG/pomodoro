import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth'
import { auth } from '@/utils/firebaseAuth'
import { useBaseAlert } from '@/components/Base/BaseAlert/index'

export const useUserStore = defineStore('user', () => {
    // 用戶資料
    const { user, getCurrentUser, isUserLoadFinish } = useUser()

    // 註冊
    const { isLoadingRegister, register, errorOfRegister } = useRegister({
        user,
    })

    // 登入
    const { isLoadingLogin, login, errorOfLogin } = useLogin({ user })

    // 登出
    const { isLoadingLogout, logout, errorOfLogout } = useLogout({
        user,
    })

    return {
        user,
        getCurrentUser,
        isUserLoadFinish,
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
    }
})

// 用戶資料
function useUser() {
    const isUserLoadFinish = ref(false)

    // 用戶資料
    const user = ref({
        email: null,
        uid: null,
    })

    // 偵測用戶狀態改變（登入、登出）
    auth.onAuthStateChanged(async (userData) => {
        if (!isUserLoadFinish.value) isUserLoadFinish.value = true

        if (userData) {
            user.value = { email: userData.email, uid: userData.uid }
        } else {
            user.value = { email: null, uid: null }
        }
    })

    function getCurrentUser() {
        return new Promise((resolve, reject) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe()
                isUserLoadFinish.value = true
                resolve(user)
            }, reject)
        })
    }
    return {
        user,
        getCurrentUser,
        isUserLoadFinish,
    }
}

// 註冊
function useRegister({ user }) {
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
function useLogin({ user }) {
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
function useLogout({ user }) {
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
