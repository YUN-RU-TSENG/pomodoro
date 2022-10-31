<script setup>
import { computed } from 'vue'
import { useCovertBetweenTimeAndPomodoro } from '@/composables/useCovertBetweenTimeAndPomodoro'

/*========== component props ========== */

const props = defineProps({
    timer: {
        type: Object,
        required: true,
    },
    pomodoroSettings: {
        type: Object,
        required: true,
    },
    selectedTaskId: {
        type: String,
        required: true,
    },
    selectedTask: {
        type: Object,
        required: true,
    },
    isShowPomodoroModal: {
        type: Boolean,
        required: true,
    },
})

/*========== component emit ========== */

const emit = defineEmits([
    'open-pomodoro-modal',
    'close-pomodoro-modal',
    'stop-pomodoro',
    'start-pomodoro',
    'break-pomodoro',
    'update-task',
    'delete-task',
])

/*========== component logic ========== */

const { covertTimeToPomodoro } = useCovertBetweenTimeAndPomodoro()

const currentPomodoro = computed(() => {
    return covertTimeToPomodoro({
        time: props.selectedTask.totalSpendTime,
        pomodoroTime: props.pomodoroSettings.pomodoro,
    })
})

const currentExpectPomodoro = computed(() => {
    return covertTimeToPomodoro({
        time: props.selectedTask.totalExpectTime,
        pomodoroTime: props.pomodoroSettings.pomodoro,
    })
})

const handlePomodoroShow = () => {
    if (props.selectedTaskId) return emit('open-pomodoro-modal')
    return null
}

// 呈現倒數時間為 mm:ss 格式
const currentFormatTime = computed(() => {
    const time = props.timer.countDownTime
    const minute = Math.floor(time / 60)
    const second = time % 60
    const formatMinute = minute < 10 ? '0' + minute : minute
    const formatSecond = second < 10 ? '0' + second : second
    return `${formatMinute}:${formatSecond}`
})

const currentDeg = computed(() => {
    if (!props.timer?.countDownTime) return
    const red = Math.floor(
        Math.floor(
            (props.timer.countDownTime / props.timer[props.timer.mode]) * 100
        ) * 3.6
    )
    const white = 360 - red
    return `calc(${white} * 3.14 * 190 * 2 / 360) calc(${red} * 3.14 * 190 * 2 / 360)`
})

const currentSmallDeg = computed(() => {
    if (!props.timer?.countDownTime) return

    const red = Math.floor(
        Math.floor(
            (props.timer.countDownTime / props.timer[props.timer.mode]) * 100
        ) * 3.6
    )
    const white = 360 - red

    return `calc(${white} * 3.14 * 16 * 2 / 360) calc(${red} * 3.14 * 16 * 2 / 360)`
})
</script>

<template>
    <!-- home-pomodoro -->
    <section :class="['home-pomodoro', isShowPomodoroModal ? 'full' : 'small']">
        <!-- home-pomodoro pomodoro-full -->
        <div :class="['pomodoro-full', isShowPomodoroModal ? '' : 'un-show']">
            <button class="toggle" @click.stop="$emit('close-pomodoro-modal')">
                <img src="@/assets/images/full-page-view-1.png" width="24" />
            </button>
            <section class="item">
                <BaseCheckbox
                    id="home-pomodoro-is-finish"
                    class="checkbox"
                    :value="selectedTask.isFinish"
                    name="home-pomodoro-is-finish"
                    @update:value="
                        $emit('update-task', {
                            ...selectedTask,
                            isFinish: $event,
                        })
                    "
                />

                <section class="content">
                    <p class="text">{{ selectedTask.name }}</p>
                    <div class="timers">
                        <img
                            src="@/assets/images/retro-alarm-clock.png"
                            width="12"
                        />
                        <span>{{ currentPomodoro }}</span>
                        <span>/</span>
                        <img
                            src="@/assets/images/retro-alarm-clock.png"
                            width="12"
                        />
                        <span>{{ currentExpectPomodoro }}</span>
                    </div>
                </section>
                <button
                    class="close"
                    @click="$emit('delete-task'), $emit('break-pomodoro')"
                >
                    <img src="@/assets/images/delete-sign.png" width="12" />
                </button>
            </section>
            <div class="clock">
                <svg height="400" width="400" viewBox="0 0 400 400" fill="red">
                    <circle
                        r="190"
                        cx="200"
                        cy="200"
                        stroke="#fff"
                        fill="none"
                        stroke-width="10"
                    />
                    <circle
                        r="190"
                        cx="200"
                        cy="200"
                        stroke="#4ed3a9"
                        fill="none"
                        :stroke-dasharray="currentDeg"
                        stroke-width="10"
                        transform-origin="center"
                        transform="rotate(270)"
                    />
                    <text
                        x="50%"
                        y="50%"
                        dominant-baseline="middle"
                        text-anchor="middle"
                        style="font-size: 72px; fill: #fff"
                    >
                        {{ currentFormatTime }}
                    </text>
                </svg>
            </div>
            <div class="buttons">
                <button
                    v-if="!timer.isStart"
                    @click.stop="$emit('start-pomodoro')"
                >
                    <img src="@/assets/images/circled-play.png" width="48" />
                </button>
                <button v-else @click.stop="$emit('stop-pomodoro')">
                    <img src="@/assets/images/circled-pause.png" width="48" />
                </button>
                <button @click.stop="$emit('break-pomodoro')">
                    <img src="@/assets/images/stop-squared.png" width="48" />
                </button>
            </div>
        </div>
        <!-- home-pomodoro pomodoro-small -->
        <div
            :class="['pomodoro-small', isShowPomodoroModal ? 'un-show' : '']"
            @click="handlePomodoroShow"
        >
            <template v-if="selectedTaskId">
                <button class="clock">
                    <svg height="36" width="36" viewBox="0 0 36 36" fill="red">
                        <circle
                            r="16"
                            cx="18"
                            cy="18"
                            stroke="#fff"
                            fill="none"
                            stroke-width="2"
                        />
                        <circle
                            r="16"
                            cx="18"
                            cy="18"
                            stroke="#4ed3a9"
                            fill="none"
                            :stroke-dasharray="currentSmallDeg"
                            stroke-width="2"
                            transform-origin="center"
                            transform="rotate(270)"
                        />
                        <text
                            x="50%"
                            y="51%"
                            dominant-baseline="middle"
                            text-anchor="middle"
                            style="font-size: 10px; fill: #fff"
                        >
                            {{ currentFormatTime }}
                        </text>
                    </svg>
                </button>
                <div class="text">{{ selectedTask.name }}</div>
                <button
                    v-show="timer.isStart"
                    class="stop"
                    @click.stop="$emit('stop-pomodoro')"
                >
                    <img src="@/assets/images/circled-pause.png" width="32" />
                </button>
                <button
                    v-show="!timer.isStart"
                    class="play"
                    @click.stop="$emit('start-pomodoro')"
                >
                    <img src="@/assets/images/circled-play.png" width="32" />
                </button>
                <button class="break" @click.stop="$emit('break-pomodoro')">
                    <img src="@/assets/images/stop-squared.png" width="24" />
                </button>
            </template>
            <template v-else>
                <p class="text empty">尚無選擇的任務</p>
            </template>
        </div>
    </section>
</template>

<style scoped lang="scss">
.home-pomodoro {
    transition: all 0.3s ease;
    background-color: $green-1;
    box-shadow: 0 0 4px $gray-2;

    &.full {
        width: 100vw;
        height: 100vh;
        bottom: 0;
        right: 0;
        border-radius: 0px;
    }

    &.small {
        width: 196px;
        height: 48px;
        border-radius: 4px;
    }

    button {
        font-size: 0;
        img {
            vertical-align: middle;
        }
    }
}

.home-pomodoro .pomodoro-full {
    padding-top: 120px;
    .toggle {
        position: absolute;
        top: 6px;
        left: 6px;
    }

    .item {
        width: 400px;
        margin: 0 auto;

        display: flex;
        align-items: center;
        padding: 6px;

        box-shadow: 0 1px 3px $gray-1;
        transition: all 0.3s ease;
        background-color: $white-1;
        border-radius: 4px;

        &:hover,
        &.active {
            background-color: $gray-0;
        }

        & > *:not(:last-child) {
            margin-right: 6px;
        }

        .checkbox {
            flex: 0 1 auto;
        }

        .content {
            flex: 1 1 auto;

            .text {
                width: 100%;
                margin-bottom: 4px;

                font-size: 12px;
                line-height: 18px;
            }

            .timers {
                font-size: 12px;
                line-height: 18px;

                & > *:not(:last-child) {
                    margin-right: 4px;
                }

                img,
                span {
                    vertical-align: middle;
                }
            }
        }

        .close {
            flex: 0 1 auto;
            align-self: flex-start;
        }
    }

    .clock {
        margin: 48px auto 0;
        text-align: center;
    }

    .buttons {
        margin: 24px auto 0;
        text-align: center;
    }
}

.home-pomodoro .pomodoro-small {
    display: flex;
    padding: 6px;
    align-items: center;

    & > *:not(:last-child) {
        margin-right: 6px;
    }

    .clock {
        flex: 0 0 auto;

        svg {
            vertical-align: middle;
        }
    }

    .text {
        flex: 1 1 auto;
        font-size: 14px;
        line-height: 21px;
        color: $white-1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .empty {
        text-align: center;
        padding-top: 6px;
    }

    .stop,
    .play,
    .break {
        flex: 0 0 auto;
    }
}

.home-pomodoro .un-show {
    display: none;
}
</style>
