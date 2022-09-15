<script setup>
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { auth } from '@/utils/firebaseAuth'
import { useUserStore } from '@/stores/user'

const initLoading = ref(true)
const router = useRouter()
const userStore = useUserStore()

/**
 * 監聽用戶 Auth 狀態，當有登入時就跳到 home 頁面，沒有登入時就跳到 login 頁面
 */
userStore.isLoading = true
auth.onAuthStateChanged(function (userData) {
    if (userData) {
        userStore.user = { email: userData.email, uid: userData.uid }
        router.push({ name: 'home' }).catch(() => {})
    } else {
        router.push({ name: 'login' }).catch(() => {})
    }
    userStore.isLoading = false
    initLoading.value = false
})
</script>

<template>
    <div>
        <RouterView />
        <BaseLoading v-if="userStore.isLoading && initLoading" />
    </div>
</template>

<style scoped></style>
