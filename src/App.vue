<script setup>
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

userStore.watchUserState()
</script>

<template>
    <div>
        <BaseLoading v-if="userStore.isLoadingForFirstWatchingUserState" />
        <RouterView />
    </div>
</template>

<style scoped></style>
