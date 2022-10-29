<script setup>
import { watch, toRef } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { colors } from './color'

/* ========== component props ========== */

const props = defineProps({
    visible: {
        type: Boolean,
        required: true,
    },
})

/* ========== component emit ========== */

const emit = defineEmits(['update:visible', 'on-submit'])

/* ========== component logic ========== */

const { onSubmit } = useFolderForm({ props })

// folder form
function useFolderForm({ props }) {
    const visible = toRef(props, 'visible')

    const { handleSubmit, resetForm } = useForm({
        validationSchema: yup.object({
            name: yup.string().required(),
            color: yup.string().required(),
        }),
        initialValues: {
            name: '',
            color: '',
        },
    })

    // 由於使用 v-if，form 會在綁定時驗證，使用 resetForm 取消初次驗證時的錯誤
    // doc: https://github.com/logaretm/vee-validate/issues/3415
    watch(visible, () => {
        resetForm()
    })

    const onSubmit = handleSubmit(
        (value) => {
            emit('on-submit', value)
            emit('update:visible', false)
        },
        (e) => {
            console.error(e)
        }
    )

    return { onSubmit }
}
</script>

<template>
    <BaseModal
        v-if="visible"
        class="home-folder-modal-confirm"
        @update:modal="$emit('update:visible', $event)"
    >
        <template #header> 創建標籤 </template>
        <template #body>
            <HomeInput id="folder-type-name" name="name"></HomeInput>
            <div class="colors">
                <div v-for="color in colors" :key="color" class="color">
                    <HomeRadio
                        :id="color"
                        name="color"
                        :value="color"
                        :color="color"
                    />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="footer">
                <BaseButton @click="$emit('update:visible', false)">
                    取消
                </BaseButton>
                <BaseButton color="primary" @click="onSubmit">確定</BaseButton>
            </div>
        </template>
    </BaseModal>
</template>

<style scoped lang="scss">
.colors {
    width: 294px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-content: space-between;
    justify-content: space-between;
    margin-top: 14px;
}

.footer {
    text-align: right;
}
</style>
