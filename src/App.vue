<script setup>
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

userStore.watchUserState()
</script>

<template>
    <div>
        <RouterView />
        <BaseLoading v-if="userStore.isLoadingForFirstWatchingUserState" />
    </div>
</template>

<style scoped></style>
