<script setup>
import { ref, watch } from 'vue'
import { useCovertBetweenTimeAndPomorodo } from '@/composables/useCovertBetweenTimeAndPomorodo'
import { formatDate } from '@/utils/dayjsFormat'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import dayjs from 'dayjs'
/* ========== component props ========== */

const props = defineProps({
    selectedTaskId: {
        type: String,
        required: true,
    },
    selectedTask: {
        type: Object,
        required: true,
    },
    folderTypes: {
        type: Array,
        required: true,
    },
    pomorodoSelectedTaskId: {
        type: String,
        required: true,
    },
    pomorodoSettings: {
        type: Object,
        required: true,
    },
})

/* ========== component emits ========== */

const emits = defineEmits([
    'update-task',
    'delete-task',
    'update:selected-task-id',
    'update:pomorodo-selected-task-id',
    'break-pomorodo',
])

/* ========== component logic ========== */

// 轉換 pomorodo 與 time(second)
const { covertTimeToPomorodo, covertPomorodoToTime } =
    useCovertBetweenTimeAndPomorodo()

// task form 狀態(包含驗證)
const { taskForm, handleVeeSubmit, resetForm, formMeta } = useTaskForm()

// 當表單更新時，且通過驗證時，自動發送 update-task 事件
useAutoSubmitTaskForm({
    handleVeeSubmit,
    emits,
    formMeta,
    taskForm,
})

// 當更新選擇標單 id 時，重置當前表單內容
useAutoUpdateTaskFormWhenSelectTaskIdChange({ props })

// cache taskForm - mentionDate, expectEndDate, totalExpectTime 表單值快取，當確認後才會將快取直更新到 taskForm
const {
    resetTaskFormCacheItem,
    taskFormCache,
    updateTaskFormByCacheAndResetCache,
} = useTaskFromCache({ taskForm, props })

// cache taskForm - subtask 子任務編輯快取，當確認後才會將快取直更新到 taskForm
const { addSubtasks, cacheSubtask } = useTaskFromCacheOfSubtask({ taskForm })

/*========== component scoped composables function ========== */

// task form 狀態(包含驗證、重置)
function useTaskForm() {
    const {
        handleSubmit: handleVeeSubmit,
        useFieldModel,
        meta: formMeta,
        resetForm,
    } = useForm({
        validationSchema: yup.object({
            name: yup.string().trim().required(),
            isFinish: yup.boolean().required(),
            description: yup.string(),
            tags: yup.array(),
            folder: yup.string(),
            subtasks: yup.array(),
            totalSpendTime: yup.number().integer(),
            totalExpectTime: yup.number().integer(),
            expectEndDate: '',
            mentionDate: '',
            createAt: '',
        }),
        initialValues: props.selectedTask,
    })

    const [
        name,
        isFinish,
        description,
        tags,
        folder,
        subtasks,
        totalSpendTime,
        totalExpectTime,
        mentionDate,
        expectEndDate,
        createAt,
    ] = useFieldModel([
        'name',
        'isFinish',
        'description',
        'tags',
        'folder',
        'subtasks',
        'totalSpendTime',
        'totalExpectTime',
        'mentionDate',
        'expectEndDate',
        'createAt',
    ])

    const taskForm = ref({
        name,
        isFinish,
        description,
        tags,
        folder,
        subtasks,
        totalSpendTime,
        totalExpectTime,
        mentionDate,
        expectEndDate,
        createAt,
    })

    return { taskForm, handleVeeSubmit, resetForm, formMeta }
}

// 當表單更新時，且通過驗證時，自動發送 update-task 事件
function useAutoSubmitTaskForm({ handleVeeSubmit, emits, formMeta, taskForm }) {
    const submitUpdateTaskForm = handleVeeSubmit((formValue, { resetForm }) => {
        emits('update-task', { formValue, resetForm })
    })

    watch(
        taskForm,
        () => {
            if (formMeta.value.dirty) submitUpdateTaskForm()
        },
        { deep: true }
    )

    return {
        submitUpdateTaskForm,
    }
}

// 偵測 prop 傳入的 select id 值變動，一但偵測到變動就重置當前表單內容
function useAutoUpdateTaskFormWhenSelectTaskIdChange({ props }) {
    watch(
        () => props.selectedTaskId,
        () => {
            resetForm({ values: props.selectedTask })
        }
    )
}

// cache taskForm (部分表單值有快取，當確認後才會將快取直更新到 taskForm)
function useTaskFromCache({ taskForm, props }) {
    const taskFormCache = ref({
        mentionDate: null,
        expectEndDate: null,
        totalExpectTime: 0,
    })

    const resetTaskFormCacheItem = (item) => {
        if (item === 'totalExpectTime') taskFormCache.value[item] = 0
        else taskFormCache.value[item] = null
    }

    const updateTaskFormByCacheAndResetCache = (item) => {
        if (item === 'totalExpectTime')
            taskForm.value[item] = covertPomorodoToTime({
                pomorodo: taskFormCache.value[item],
                pomorodoTime: props.pomorodoSettings.pomorodo,
            })
        else taskForm.value[item] = taskFormCache.value[item]

        resetTaskFormCacheItem(item)
    }

    return {
        resetTaskFormCacheItem,
        taskFormCache,
        updateTaskFormByCacheAndResetCache,
    }
}

// cache taskForm Subtask 子任務編輯快取
function useTaskFromCacheOfSubtask({ taskForm }) {
    const cacheSubtask = ref({
        name: '',
        isFinish: false,
    })

    const addSubtasks = () => {
        if (!cacheSubtask.value.name) return

        taskForm.value.subtasks = [
            ...taskForm.value.subtasks,
            { ...cacheSubtask.value },
        ]

        cacheSubtask.value = {
            name: '',
            isFinish: false,
        }
    }

    return {
        addSubtasks,
        cacheSubtask,
    }
}
</script>

<template>
    <section class="home-task-edit-box">
        <header class="edit-box-header">
            <section class="title">
                <BaseCheckbox
                    id="home-task-edit-bar-is-finish"
                    v-model:value="taskForm.isFinish"
                    name="home-task-edit-bar-is-finish"
                />
                <HomeStartTimer
                    :id="'pomorodo-selected-task-editor' + selectedTaskId"
                    name="pomorodo-selected-task-editor"
                    :value="selectedTaskId"
                    :checked-value="pomorodoSelectedTaskId"
                    @update:value="
                        $emit(
                            'update:pomorodo-selected-task-id',
                            selectedTaskId
                        )
                    "
                />
                <input v-model="taskForm.name" type="text" />
                <button>
                    <img src="@/assets/images/empty-flag.png" width="20" />
                </button>
            </section>
        </header>
        <div class="edit-box-line"></div>
        <main class="edit-box-main">
            <section class="list">
                <ul>
                    <li>
                        <img
                            src="@/assets/images/retro-alarm-clock.png"
                            width="20"
                        />
                        <h4>番茄鐘</h4>
                        <BasePopover width="200px">
                            <template #button>
                                <button class="pomorodo">
                                    <img
                                        src="@/assets/images/retro-alarm-clock.png"
                                        width="14"
                                    />
                                    <span>{{
                                        taskForm.totalSpendTime
                                            ? covertTimeToPomorodo({
                                                  time: taskForm.totalSpendTime,
                                                  pomorodoTime:
                                                      pomorodoSettings.pomorodo,
                                              })
                                            : '0'
                                    }}</span>
                                    <span class="gray">/</span>
                                    <img
                                        src="@/assets/images/retro-alarm-clock.png"
                                        width="14"
                                    />
                                    <span>{{
                                        covertTimeToPomorodo({
                                            time: taskForm.totalExpectTime,
                                            pomorodoTime:
                                                pomorodoSettings.pomorodo,
                                        })
                                    }}</span>
                                </button>
                            </template>
                            <template #model="slotProps">
                                <HomeNumberConfirm
                                    v-model:value="
                                        taskFormCache.totalExpectTime
                                    "
                                    @confirm="
                                        updateTaskFormByCacheAndResetCache(
                                            'totalExpectTime'
                                        ),
                                            slotProps.close()
                                    "
                                    @cancel="
                                        slotProps.close(),
                                            resetTaskFormCacheItem(
                                                'totalExpectTime'
                                            )
                                    "
                                />
                            </template>
                        </BasePopover>
                    </li>
                    <li>
                        <img
                            src="@/assets/images/calendar--v1.png"
                            width="20"
                        />
                        <h4>預計完成日</h4>
                        <BasePopover width="200px">
                            <template #button>
                                <button class="date">
                                    {{
                                        taskForm.expectEndDate
                                            ? formatDate({
                                                  date: taskForm.expectEndDate,
                                              })
                                            : '無'
                                    }}
                                </button>
                            </template>
                            <template #model="slotProps">
                                <HomeCalender
                                    v-model:value="taskFormCache.expectEndDate"
                                    :min="
                                        dayjs(taskForm.createAt).format(
                                            'YYYY/MM/DD'
                                        )
                                    "
                                    @confirm="
                                        updateTaskFormByCacheAndResetCache(
                                            'expectEndDate'
                                        ),
                                            slotProps.close()
                                    "
                                    @cancel="
                                        slotProps.close(),
                                            resetTaskFormCacheItem(
                                                'expectEndDate'
                                            )
                                    "
                                />
                            </template>
                        </BasePopover>
                    </li>
                    <li>
                        <img
                            src="@/assets/images/folder-invoices--v1.png"
                            width="20"
                        />
                        <h4>資料夾</h4>
                        <BasePopover width="200px">
                            <template #button>
                                <button class="folder">
                                    {{ taskForm.folder || '無' }}
                                </button>
                            </template>
                            <template #model="slotProps">
                                <HomeDropdownConfirm
                                    v-model:value="taskForm.folder"
                                    name="update-task-form-folder"
                                    :contents="folderTypes"
                                    @close-dropdown="slotProps.close()"
                                />
                            </template>
                        </BasePopover>
                    </li>
                    <li>
                        <img src="@/assets/images/bell--v1.png" width="20" />
                        <h4>提醒</h4>
                        <BasePopover width="200px">
                            <template #button>
                                <button class="folder">
                                    {{
                                        taskForm.mentionDate
                                            ? formatDate({
                                                  date: taskForm.mentionDate,
                                              })
                                            : '無'
                                    }}
                                </button>
                            </template>
                            <template #model="slotProps">
                                <HomeCalender
                                    v-model:value="taskFormCache.mentionDate"
                                    :max="
                                        taskForm.expectEndDate
                                            ? dayjs(
                                                  taskForm.expectEndDate
                                              ).format('YYYY/MM/DD')
                                            : null
                                    "
                                    @confirm="
                                        updateTaskFormByCacheAndResetCache(
                                            'mentionDate'
                                        ),
                                            slotProps.close()
                                    "
                                    @cancel="
                                        slotProps.close(),
                                            resetTaskFormCacheItem(
                                                'mentionDate'
                                            )
                                    "
                                />
                            </template>
                        </BasePopover>
                    </li>
                </ul>
            </section>
            <section class="subtask">
                <ul v-if="taskForm.subtasks?.length">
                    <li
                        v-for="(subtask, index) in taskForm.subtasks"
                        :key="index"
                    >
                        <BaseCheckbox
                            :id="'home-subtask-edit-is-finish' + index"
                            :value="subtask.isFinish"
                            :name="'home-subtask-edit-is-finish' + index"
                            @update:value="
                                taskForm.subtasks[index].isFinish =
                                    !taskForm.subtasks[index].isFinish
                            "
                        />
                        <HomeStartTimer
                            :id="'pomorodo-selected-task' + selectedTaskId"
                            name="pomorodo-selected-task"
                            :value="selectedTaskId"
                            :checked-value="pomorodoSelectedTaskId"
                            @update:value="
                                $emit(
                                    'update:pomorodo-selected-task-id',
                                    selectedTaskId
                                )
                            "
                        />
                        <h3>{{ subtask.name }}</h3>
                    </li>
                </ul>

                <form @submit.prevent="addSubtasks">
                    <button>
                        <img
                            src="@/assets/images/plus-math--v1.png"
                            width="20"
                        />
                    </button>
                    <input
                        v-model.trim="cacheSubtask.name"
                        placeholder="子任務"
                        type="text"
                    />
                </form>
            </section>
            <section class="description">
                <HomeTaskEditBarTextArea v-model:value="taskForm.description" />
            </section>
        </main>
        <div class="edit-box-line"></div>
        <footer class="edit-box-footer">
            <button @click="$emit('update:selected-task-id', '')">
                <img src="@/assets/images/full-page-view.png" width="20" />
            </button>
            <p>
                創建於
                {{
                    formatDate({
                        date: taskForm.createAt,
                        formatString: 'YYYY年MM月DD日',
                    })
                }}
            </p>
            <button @click="$emit('delete-task'), $emit('break-pomorodo')">
                <img src="@/assets/images/trash--v1.png" width="20" />
            </button>
        </footer>
    </section>
</template>

<style scoped lang="scss">
.home-task-edit-box {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 280px;
    border-radius: 4px;
    background-color: $white-1;
    box-shadow: 0 0 4px $gray-1;

    button {
        font-size: 0;
        transition: all 0.3s ease;
        &:hover {
            background-color: $gray-0;
            border-radius: 4px;
        }
    }
}

.home-task-edit-box .edit-box-header {
    flex: 0 0 auto;
    padding: 12px;

    .title {
        display: flex;
        align-items: flex-start;
        margin-bottom: 18px;

        & > *:not(:last-child) {
            margin-right: 6px;
        }

        h3 {
            flex: 1 1 auto;
            font-size: 14px;
            line-height: 21px;
            color: $gray-4;
        }
    }
}

.home-task-edit-box .edit-box-main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    padding: 0 12px;

    .list {
        flex: 0 0 auto;

        li {
            display: flex;
            align-items: center;
            padding: 6px 0;

            & > *:not(:last-child) {
                margin-right: 6px;
            }
        }

        h4 {
            flex: 1 1 auto;
            font-size: 14px;
            line-height: 21px;
            font-weight: 300;
            color: $gray-4;
        }

        button {
            margin-left: auto;
            padding: 4px;

            font-size: 14px;
            line-height: 21px;
            color: $gray-4;
        }

        .pomorodo {
            font-size: 0;
            line-height: 0;
            span {
                font-size: 14px;
                line-height: 21px;
                color: $gray-4;
            }
            span,
            img {
                vertical-align: middle;
            }
            .gray {
                color: $gray-2;
            }
        }
    }
    .subtask {
        flex: 0 0 auto;
        padding: 12px 0;
        border-top: 1px solid $gray-1;
        border-bottom: 1px solid $gray-1;

        ul {
            margin-bottom: 12px;
        }

        li {
            display: flex;
            align-items: center;

            &:not(:last-child) {
                margin-bottom: 12px;
            }

            & > *:not(:last-child) {
                margin-right: 6px;
            }
        }

        h3 {
            font-size: 14px;
            line-height: 21px;
            color: $gray-4;
        }

        form {
            display: flex;
            align-items: center;
        }

        button {
            margin-right: 6px;
        }

        input {
            font-size: 14px;
            line-height: 21px;
            color: $gray-4;
        }
    }
    .description {
        flex: 1 1 auto;
        padding: 12px 0;
        display: flex;
        flex-direction: column;
    }
}

.home-task-edit-box .edit-box-footer {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 12px 9px;

    P {
        font-size: 14px;
        line-height: 21px;
        color: $gray-4;
    }
    button {
        padding: 2px;
    }
}

.home-task-edit-box .edit-box-line {
    flex: 0 0 1px;
    margin: 0 12px;
    background-color: $gray-1;
}
</style>
