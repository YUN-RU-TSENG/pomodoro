<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { colors } from './color'

/* ========== component props ========== */

const props = defineProps({
    visible: {
        type: Boolean,
        required: true,
    },
    currentFolders: { type: Array, required: true },
})

/* ========== component emit ========== */

const emit = defineEmits(['update:visible', 'on-submit'])

/* ========== component logic ========== */

const {
    submitForm,
    name,
    selectColor,
    submitCountOfForm,
    errorsOfForm,
    resetForm,
} = useFolderForm({ props })

// folder form
function useFolderForm({ props }) {
    const { handleSubmit, useFieldModel, submitCount, errors, resetForm } =
        useForm({
            validationSchema: yup.object({
                name: yup
                    .string()
                    .test(
                        'not-duplicate',
                        '已有相同的 folder 名稱 - ${value}',
                        (value) =>
                            props.currentFolders.every((folder) => {
                                return value !== folder.name
                            })
                    )
                    .required(),
                color: yup.string().required(),
            }),
            initialValues: {
                name: '',
                color: colors[0],
            },
        })

    // name
    const name = useFieldModel('name')

    // color
    const color = useFieldModel('color')

    const onSubmit = handleSubmit(
        (value, { resetForm }) => {
            emit('on-submit', value)
            emit('update:visible', false)
            resetForm()
        },
        (e) => {
            console.error(e)
        }
    )

    return {
        submitForm: onSubmit,
        name,
        selectColor: color,
        submitCountOfForm: submitCount,
        errorsOfForm: errors,
        resetForm,
    }
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
            <BaseInput
                id="folder-type-name"
                v-model:value="name"
                name="folder-type-name"
                :error="submitCountOfForm ? errorsOfForm.name : ''"
            />
            <div class="colors">
                <div v-for="color in colors" :key="color" class="color">
                    <HomeRadio
                        :id="color"
                        v-model:check-value="selectColor"
                        name="color"
                        :value="color"
                        :color="color"
                    />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="footer">
                <BaseButton
                    @click="$emit('update:visible', false), resetForm()"
                >
                    取消
                </BaseButton>
                <BaseButton color="primary" @click="submitForm">
                    確定
                </BaseButton>
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
