<script setup>
import { RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePomodoroSetting } from '@/stores/pomodoroSetting'

/* ========== router ========== */
const router = useRouter()

/* ========== pinia ========== */
// pinia - userStore
const userStore = useUserStore()

// pinia - pomodoroSettingStore
const pomodoroSettingStore = usePomodoroSetting()

/* ========== component logic ========== */
const { handleLogout } = useHandleLogout({
    userStore,
    router,
})

/*========== component scoped composables function ========== */
// logout
function useHandleLogout({ userStore, router }) {
    const handleLogout = async () => {
        await userStore.logout()
        if (!userStore.errorOfLogout) router.push({ name: 'login' })
    }
    return { handleLogout }
}
</script>

<template>
    <BaseNavbar
        class="app-navbar"
        :user="userStore.user"
        @user-logout="handleLogout"
    />
    <BaseLoading
        v-if="pomodoroSettingStore.isLoadingPomodoroSettingGet"
        text="加載用戶配置"
    />
    <RouterView v-else />
</template>

<style lang="scss" scoped>
.app-navbar {
    position: relative;
    z-index: 9;
}
</style>
