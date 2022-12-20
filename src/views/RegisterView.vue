<script setup>
import { useUserStore } from '@/stores/user'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/* ========== router ========== */

const router = useRouter()

/* ========== pinia ========== */

// pinia - userStore
const userStore = useUserStore()

/* ========== component logic ========== */

// user form
const {
    handleVeeUserFormSubmit,
    submitCountOfUserForm,
    errorsOfUserForm,
    userForm,
} = useUserForm()

// submitRegister
const { submitRegister } = useSubmitUserForm({
    handleVeeUserFormSubmit,
    userStore,
})

/*========== component scoped composables function ========== */

// user form
function useUserForm() {
    // vee validate 驗證設置
    const {
        handleSubmit: handleVeeUserFormSubmit,
        submitCount,
        useFieldModel,
        errors,
    } = useForm({
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
        handleVeeUserFormSubmit,
        submitCountOfUserForm: submitCount,
        errorsOfUserForm: errors,
        userForm,
    }
}

// submit user form
function useSubmitUserForm({ handleVeeUserFormSubmit, userStore }) {
    const submitRegister = handleVeeUserFormSubmit(async (formValue) => {
        await userStore.register(formValue)
        if (!userStore.errorOfRegister) router.push({ name: 'home' })
    })

    return {
        submitRegister,
    }
}
</script>

<template>
    <AuthenticationLayout class="user-validate">
        <AuthenticationForm
            title="Register"
            text="Pomodoro todo 優雅的使用待辦清單以及番茄鐘"
            tip-text="已有帳號？"
            tip-button-text="登入"
            @submit-form="submitRegister"
            @change-page="$router.push({ name: 'login' })"
        >
            <BaseInput
                id="auth-register-email"
                v-model:value="userForm.email"
                placeholder="請輸入信箱"
                :error="submitCountOfUserForm ? errorsOfUserForm.email : ''"
            />
            <BaseInput
                id="auth-register-password"
                v-model:value="userForm.password"
                type="password"
                placeholder="請輸入密碼"
                :error="submitCountOfUserForm ? errorsOfUserForm.password : ''"
            />
            <BaseButton color="primary">註冊</BaseButton>
        </AuthenticationForm>
        <BaseLoading v-if="userStore.isLoadingRegister" />
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
