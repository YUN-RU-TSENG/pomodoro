<script setup>
import dayjs from 'dayjs'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// ========== component props ==========

defineProps({
    pomorodoTime: {
        type: Number,
        required: true,
    },
    folderTypes: {
        type: Array,
        required: true,
    },
})

// ========== component emits ==========

const emits = defineEmits(['add-tasks'])

// ========== component logic ==========

// add task form
const { submitAddTaskForm } = useAddTaskForm({ emits })

// ========== component scoped composables function ==========

// add task form
function useAddTaskForm({ emits }) {
    // add task form vee validate 驗證設置
    const { handleSubmit } = useForm({
        validationSchema: yup.object({
            isFinish: yup.boolean().required(),
            name: yup.string().trim().required(),
            description: yup.string(),
            tags: yup.array(),
            folder: yup.string(),
            totalSpendTime: yup.number().integer(),
            pomorodoTime: yup.number(),
            totalExpectTime: yup.number().integer(),
            subtasks: yup.array(),
            createAt: '',
            expectEndDate: '',
            mentionDate: '',
        }),
        initialValues: {
            isFinish: false,
            name: '',
            description: '',
            tags: [],
            folder: '',
            totalSpendTime: 0,
            pomorodoTime: 1000 * 60 * 25,
            totalExpectTime: 0,
            subtasks: [],
            createAt: dayjs().toISOString(),
            expectEndDate: dayjs().toISOString(),
            mentionDate: null,
        },
    })

    // 驗證成功時，透過 add-tasks 事件發送表單值
    const submitAddTaskForm = handleSubmit((formValue, { resetForm }) => {
        emits('add-tasks', { formValue, resetForm })
    })
    return { submitAddTaskForm }
}
</script>

<template>
    <form class="home-add-task" @submit.prevent="submitAddTaskForm">
        <button class="add-task-button home-add-task-button" type="submit">
            <img src="@/assets/images/add--v1.png" width="22" />
        </button>
        <div class="add-task-input">
            <HomeAddInput
                name="name"
                placeholder="輸入待辦 task，例如: 閱讀書籍"
            />
        </div>
        <section class="add-task-watch">
            <HomeAddTaskClocks :pomorodo-time="pomorodoTime" />
        </section>
        <div class="add-task-line"></div>
        <BasePopover width="200px">
            <template #button>
                <button
                    class="add-task-color home-add-task-button"
                    type="button"
                >
                    <img src="@/assets/images/circled-dot.png" width="18" />
                </button>
            </template>
            <template #model="slotProps">
                <BaseDropdown
                    :contents="folderTypes"
                    name="folder"
                    @choose-content="slotProps.close()"
                />
            </template>
        </BasePopover>
    </form>
</template>

<style scoped lang="scss">
.home-add-task {
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;

    background-color: $white-1;
    box-shadow: 0px 0px 4px $gray-1;
    border-radius: 4px;
    margin-bottom: 24px;

    & > *:not(:last-child) {
        margin-right: 8px;
    }
}

.home-add-task-button {
    padding: 2px;

    border-radius: 4px;
    transition: all 0.3s ease;
    background-color: $white-1;
    font-size: 0;

    &:hover {
        background-color: $gray-0;
    }
}

.home-add-task .add-task-button {
    flex: 0 1 auto;
}

.home-add-task .add-task-input {
    flex: 1 1 auto;
}

.home-add-task .add-task-watch {
    display: flex;
    align-items: center;
}

.home-add-task .add-task-line {
    flex: 0 1 1px;
    align-self: stretch;

    background-color: $gray-1;
}

.home-add-task .add-task-arrow {
    flex: 0 1 auto;
    /* 第二層 flex */
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
