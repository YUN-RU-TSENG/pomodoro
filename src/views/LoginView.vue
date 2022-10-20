<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

/* ========== pinia ========== */

// pinia - userStore
const userStore = useUserStore()
const { isLoadingLogin } = storeToRefs(userStore)
const { login } = userStore

/* ========== component logic ========== */

// user form
const {
    handleVeeUserFormSubmit,
    submitCountOfUserForm,
    errorsOfUserForm,
    userForm,
} = useUserForm()

// submitUserLogin
const { submitLogin } = useSubmitUserForm({ handleVeeUserFormSubmit })

/*========== component scoped composables function ========== */

// user form
function useUserForm() {
    // vee validate 驗證設置
    const { handleSubmit, submitCount, useFieldModel, errors } = useForm({
        validationSchema: yup.object({
            email: yup.string().email().required(),
            password: yup.string().min(6).required(),
        }),
        initialValues: {
            email: '',
            password: '',
        },
    })

    const [email, password] = useFieldModel(['email', 'password'])

    const userForm = ref({
        email,
        password,
    })

    return {
        handleVeeUserFormSubmit: handleSubmit,
        submitCountOfUserForm: submitCount,
        errorsOfUserForm: errors,
        userForm,
    }
}

// submit user form
function useSubmitUserForm({ handleVeeUserFormSubmit }) {
    const submitLogin = handleVeeUserFormSubmit((formValue) => {
        login(formValue)
    })

    return {
        submitLogin,
    }
}
</script>

<template>
    <AuthenticationLayout class="user-validate">
        <AuthenticationForm
            title="Login"
            text="Pomorodo todo 優雅的使用待辦清單以及番茄鐘"
            tip-text="沒有帳號？"
            tip-button-text="註冊"
            @submit-form="submitLogin"
            @change-page="$router.push({ name: 'register' })"
        >
            <BaseInput
                id="auth-login-email"
                v-model:value="userForm.email"
                placeholder="請輸入信箱"
                :error="submitCountOfUserForm ? errorsOfUserForm.email : ''"
            ></BaseInput>
            <BaseInput
                id="auth-login-password"
                v-model:value="userForm.password"
                type="password"
                placeholder="請輸入密碼"
                :error="submitCountOfUserForm ? errorsOfUserForm.password : ''"
            ></BaseInput>
            <BaseButton color="primary">登入</BaseButton>
        </AuthenticationForm>
        <BaseLoading v-if="isLoadingLogin" />
    </AuthenticationLayout>
</template>

<style lang="scss" scoped>
.user-validate .base-input-label {
    margin-bottom: 12px;
}

.user-validate .base-button {
    width: 100%;
}
</style>
