<script setup>
import { ref, computed } from 'vue'
import { formatTimestamp } from '@/utils/dayjsFormat.js'
import { useCovertBetweenTimeAndTomato } from '@/composables/useCovertBetweenTimeAndTomato'
import { formaDate } from '@/utils/dayjsFormat'
const props = defineProps({
    cacheUpdateForm: {
        type: Object,
        required: true,
    },
})

defineEmits([
    'play-tomato',
    'update:cacheUpdateForm',
    'delete-task',
    'close-task-detail',
])

const isPlay = ref(false)
const cacheTotalTimes = ref(0)
const cacheExpectEndDate = ref(null)
const cacheMentionDate = ref(null)

const { covertTimeToTomato, covertTomatoToTime } =
    useCovertBetweenTimeAndTomato()

const currentTomato = computed(() => {
    return covertTimeToTomato({
        time: props.cacheUpdateForm.totalExpectTime,
        tomatoTime: props.cacheUpdateForm.tomatoTime,
    })
})
const currentSpendTomato = computed(() => {
    return covertTimeToTomato({
        time: props.cacheUpdateForm.totalSpendTime,
        tomatoTime: props.cacheUpdateForm.tomatoTime,
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
                        $emit('update:cacheUpdateForm', {
                            ...cacheUpdateForm,
                            isFinish: $event,
                        })
                    "
                />
                <HomeStartTimer
                    :value="isPlay"
                    @update:value="$emit('play-tomato')"
                />
                <input
                    type="text"
                    :value="cacheUpdateForm.name"
                    @input="
                        $emit('update:cacheUpdateForm', {
                            ...cacheUpdateForm,
                            name: $event.target.value,
                        })
                    "
                />
                <button>
                    <img
                        src="@/assets/images/empty-flag.png"
                        alt=""
                        width="20"
                    />
                </button>
            </section>
            <section class="tags">
                <div class="tag">
                    <span>標籤名稱</span>
                </div>
                <button class="add-tag tag">
                    <img
                        src="@/assets/images/plus-math--v1.png"
                        alt=""
                        width="12"
                    />
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
                            alt=""
                            width="20"
                        />
                        <h4>番茄鐘</h4>
                        <BasePopover width="200px">
                            <template #button>
                                <button class="tomato">
                                    <img
                                        src="@/assets/images/retro-alarm-clock.png"
                                        alt=""
                                        width="14"
                                    />
                                    <span>{{ currentSpendTomato }}</span>
                                    <span class="gray">/</span>
                                    <img
                                        src="@/assets/images/retro-alarm-clock.png"
                                        alt=""
                                        width="14"
                                    />
                                    <span>{{ currentTomato }}</span>
                                </button>
                            </template>
                            <template #model="slotProps">
                                <HomeNumberPopConfirm
                                    :value="cacheTotalTimes"
                                    @cancel="slotProps.close()"
                                    @confirm="
                                        $emit('update:cacheUpdateForm', {
                                            ...cacheUpdateForm,
                                            totalExpectTime: covertTomatoToTime(
                                                {
                                                    tomatoTime:
                                                        cacheUpdateForm.tomatoTime,
                                                    tomato: cacheTotalTimes,
                                                }
                                            ),
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
                            alt=""
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
                                        $emit('update:cacheUpdateForm', {
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
                            alt=""
                            width="20"
                        />
                        <h4>資料夾</h4>
                        <BasePopover width="200px">
                            <template #button>
                                <button class="folder">文字</button>
                            </template>
                            <template>
                                <HomeDropdownPopConfirm></HomeDropdownPopConfirm>
                            </template>
                        </BasePopover>
                    </li>
                    <li>
                        <img
                            src="@/assets/images/bell--v1.png"
                            alt=""
                            width="20"
                        />
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
                                        $emit('update:cacheUpdateForm', {
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
                <ul>
                    <li>
                        <BaseCheckbox
                            :value="cacheUpdateForm.isFinish"
                            @update:value="$emit('update:cacheUpdateForm')"
                        />
                        <HomeStartTimer
                            :value="isPlay"
                            @input="$emit('play-tomato')"
                        />
                        <h3>任務名稱</h3>
                    </li>
                </ul>

                <form>
                    <button>
                        <img
                            src="@/assets/images/plus-math--v1.png"
                            alt=""
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
                        $emit('update:cacheUpdateForm', {
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
                <img
                    src="@/assets/images/full-page-view.png"
                    alt=""
                    width="20"
                />
            </button>
            <p>
                創建於
                {{
                    formatTimestamp({
                        timestampSecond: cacheUpdateForm.createAt.seconds,
                        formatString: 'YYYY 年 MM 月 DD 日',
                    })
                }}
            </p>
            <button @click="$emit('delete-task')">
                <img src="@/assets/images/trash--v1.png" alt="" width="20" />
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

        .tomato {
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
