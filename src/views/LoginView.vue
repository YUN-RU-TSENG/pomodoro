<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const goRegisterPage = () => {
    router.push({ name: 'register' })
    userStore.resetUserForm()
}
</script>

<template>
    <AuthenticationLayout class="user-validate">
        <AuthenticationForm
            title="Login"
            text="Tomato todo 優雅的使用待辦清單以及番茄鐘"
            tip-text="沒有帳號？"
            tip-button-text="註冊"
            @submit-form="userStore.login"
            @change-page="goRegisterPage"
        >
            <BaseInput
                id="auth-email"
                v-model:value="userStore.userForm.email"
                placeholder="請輸入信箱"
                :error="
                    userStore.userFormSubmitCount
                        ? userStore.userFormErrorMessage.email
                        : ''
                "
            ></BaseInput>
            <BaseInput
                id="auth-password"
                v-model:value="userStore.userForm.password"
                type="password"
                placeholder="請輸入密碼"
                :error="
                    userStore.userFormSubmitCount
                        ? userStore.userFormErrorMessage.password
                        : ''
                "
            ></BaseInput>
            <BaseButton color="red">登入</BaseButton>
        </AuthenticationForm>
        <BaseLoading v-if="userStore.isLoading" />
    </AuthenticationLayout>
</template>

<style lang="scss" scoped>
.user-validate {
}

.user-validate .base-input-label {
    margin-bottom: 12px;
}

.user-validate .base-button {
    width: 100%;
}
</style>
