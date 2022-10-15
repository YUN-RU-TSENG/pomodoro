<script setup>
import { ref, computed } from 'vue'
import { formatTimestamp } from '@/utils/dayjsFormat.js'
import { useCovertBetweenTimeAndPomorodo } from '@/composables/useCovertBetweenTimeAndPomorodo'
import { formaDate } from '@/utils/dayjsFormat'

const props = defineProps({
    cacheUpdateForm: {
        type: Object,
        required: true,
    },
    fileTypes: {
        type: Array,
        required: true,
    },
    pomorodoSelectedTaskId: {
        type: String,
        required: true,
    },
})

defineEmits([
    'play-pomorodo',
    'update:cache-update-form',
    'delete-task',
    'close-task-detail',
    'update:pomorodoSelectedTaskId',
])

const cacheTotalTimes = ref(0)
const cacheExpectEndDate = ref(null)
const cacheMentionDate = ref(null)

const { covertTimeToPomorodo, covertPomorodoToTime } =
    useCovertBetweenTimeAndPomorodo()

const currentPomorodo = computed(() => {
    return covertTimeToPomorodo({
        time: props.cacheUpdateForm.totalExpectTime,
        pomorodoTime: props.cacheUpdateForm.pomorodoTime,
    })
})
const currentSpendPomorodo = computed(() => {
    return covertTimeToPomorodo({
        time: props.cacheUpdateForm.totalSpendTime,
        pomorodoTime: props.cacheUpdateForm.pomorodoTime,
    })
})
</script>

<template>
    <!-- home-task-edit-box -->
    <section class="home-task-edit-box">
        <!-- home-task-edit-box edit-box-header -->
        <header class="edit-box-header">
            <section class="title">
                <BaseCheckbox
                    :value="cacheUpdateForm.isFinish"
                    @update:value="
                        $emit('update:cache-update-form', {
                            ...cacheUpdateForm,
                            isFinish: $event,
                        })
                    "
                />
                <HomeStartTimer
                    :id="'poromodo-selected-task-editor' + cacheUpdateForm.id"
                    name="poromodo-selected-task-editor"
                    :value="cacheUpdateForm.id"
                    :checked-value="pomorodoSelectedTaskId"
                    @update:value="
                        $emit(
                            'update:pomorodoSelectedTaskId',
                            cacheUpdateForm.id
                        )
                    "
                />
                <input
                    type="text"
                    :value="cacheUpdateForm.name"
                    @input="
                        $emit('update:cache-update-form', {
                            ...cacheUpdateForm,
                            name: $event.target.value,
                        })
                    "
                />
                <button>
                    <img src="@/assets/images/empty-flag.png" width="20" />
                </button>
            </section>
            <section class="tags">
                <div class="tag">
                    <span>標籤名稱</span>
                </div>
                <button class="add-tag tag">
                    <img src="@/assets/images/plus-math--v1.png" width="12" />
                    <span>標籤</span>
                </button>
            </section>
        </header>
        <!-- home-task-edit-box edit-box-line -->
        <div class="edit-box-line"></div>
        <!-- home-task-edit-box edit-box-main -->
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
                                    <span>{{ currentSpendPomorodo }}</span>
                                    <span class="gray">/</span>
                                    <img
                                        src="@/assets/images/retro-alarm-clock.png"
                                        width="14"
                                    />
                                    <span>{{ currentPomorodo }}</span>
                                </button>
                            </template>
                            <template #model="slotProps">
                                <HomeNumberConfirm
                                    :value="cacheTotalTimes"
                                    @cancel="slotProps.close()"
                                    @confirm="
                                        $emit('update:cache-update-form', {
                                            ...cacheUpdateForm,
                                            totalExpectTime:
                                                covertPomorodoToTime({
                                                    pomorodoTime:
                                                        cacheUpdateForm.pomorodoTime,
                                                    pomorodo: cacheTotalTimes,
                                                }),
                                        }),
                                            slotProps.close()
                                    "
                                    @update:value="cacheTotalTimes = $event"
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
                                        cacheUpdateForm.expectEndDate
                                            ? formaDate({
                                                  date: cacheUpdateForm.expectEndDate,
                                              })
                                            : '無'
                                    }}
                                </button>
                            </template>
                            <template #model="slotProps">
                                <HomeCalender
                                    :value="cacheExpectEndDate"
                                    @confirm="
                                        $emit('update:cache-update-form', {
                                            ...cacheUpdateForm,
                                            expectEndDate: cacheExpectEndDate,
                                        }),
                                            slotProps.close()
                                    "
                                    @cancel="slotProps.close()"
                                    @update:value="cacheExpectEndDate = $event"
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
                                    {{
                                        cacheUpdateForm.folder
                                            ? cacheUpdateForm.folder
                                            : '無'
                                    }}
                                </button>
                            </template>
                            <template #model="slotProps">
                                <HomeDropdownConfirm
                                    :contents="fileTypes"
                                    :value="cacheUpdateForm.folder"
                                    name="detail-task-file-name"
                                    @update:value="
                                        $emit('update:cache-update-form', {
                                            ...cacheUpdateForm,
                                            folder: $event,
                                        }),
                                            slotProps.close()
                                    "
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
                                        cacheUpdateForm.mentionDate
                                            ? formaDate({
                                                  date: cacheUpdateForm.mentionDate,
                                              })
                                            : '無'
                                    }}
                                </button>
                            </template>
                            <template #model="slotProps">
                                <HomeCalender
                                    :value="cacheMentionDate"
                                    @confirm="
                                        $emit('update:cache-update-form', {
                                            ...cacheUpdateForm,
                                            mentionDate: cacheMentionDate,
                                        }),
                                            slotProps.close()
                                    "
                                    @cancel="slotProps.close()"
                                    @update:value="cacheMentionDate = $event"
                                />
                            </template>
                        </BasePopover>
                    </li>
                </ul>
            </section>
            <section class="subtask">
                <ul v-if="cacheUpdateForm.subtasks.length">
                    <li v-for="(subtask, index) in subtasks" :key="index">
                        <BaseCheckbox
                            :value="subtask.isFinish"
                            @update:value="$emit('update:cache-update-form')"
                        />
                        <HomeStartTimer
                            :id="'poromodo-selected-task' + task.id"
                            name="poromodo-selected-task"
                            :value="cacheUpdateForm.id"
                            :checked-value="pomorodoSelectedTaskId"
                            @update:value="
                                $emit(
                                    'update:pomorodoSelectedTaskId',
                                    cacheUpdateForm.id
                                )
                            "
                        />
                        <h3>{{ subtask }}</h3>
                    </li>
                </ul>

                <form>
                    <button>
                        <img
                            src="@/assets/images/plus-math--v1.png"
                            width="20"
                        />
                    </button>
                    <input placeholder="子任務" type="text" />
                </form>
            </section>

            <section class="description">
                <HomeTaskEditBarTextArea
                    :value="cacheUpdateForm.description"
                    @input="
                        $emit('update:cache-update-form', {
                            ...cacheUpdateForm,
                            description: $event.target.value,
                        })
                    "
                />
            </section>
        </main>
        <!-- home-task-edit-box edit-box-line -->
        <div class="edit-box-line"></div>
        <!-- home-task-edit-box edit-box-footer -->
        <footer class="edit-box-footer">
            <button @click="$emit('close-task-detail')">
                <img src="@/assets/images/full-page-view.png" width="20" />
            </button>
            <p>
                創建於
                {{
                    formatTimestamp({
                        timestampSecond: cacheUpdateForm.createAt.seconds,
                        formatString: 'YYYY年MM月DD日',
                    })
                }}
            </p>
            <button @click="$emit('delete-task')">
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

    .tags {
        font-size: 0px;
        .tag {
            display: inline-block;
            padding: 0 6px;
            border-radius: 12px;
            font-size: 12px;
            line-height: 18px;
            background-color: $red-1;
            border: 1px solid $red-2;
            &:not(:last-child) {
                margin-right: 6px;
            }

            img,
            span {
                margin-right: 2px;
                vertical-align: middle;
            }
        }

        .add-tag {
            background-color: transparent;
            border: 1px dashed $gray-3;
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
