<script setup>
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

// ========== pinia ==========

// pinia - userStore
const userStore = useUserStore()
const { watchUserState, isLoadingForFirstWatchingUserState } =
    storeToRefs(userStore)

// ========== component logic ==========
watchUserState() // 監聽用戶狀態，如果已登入 Firebase 且尚未登出，會自動登入
</script>

<template>
    <div>
        <BaseLoading v-if="isLoadingForFirstWatchingUserState" />
        <RouterView />
    </div>
</template>
