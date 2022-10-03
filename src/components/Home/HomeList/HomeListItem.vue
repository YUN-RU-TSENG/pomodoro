<script setup>
import { ref, nextTick } from 'vue'
import { formatTimestamp } from '@/utils/dayjsFormat.js'

defineProps({
    task: {
        type: Object,
        required: true,
    },
})

defineEmits([
    'open-task-detail',
    'close-task-detail',
    'update:task',
    'play-tomato',
])

const isEdit = ref(false)
const isTimeStart = ref(false)
const input = ref(null)

function focusInput() {
    isEdit.value = true

    nextTick(() => {
        input.value?.focus()
    })
}
</script>

<template>
    <li
        class="list-item-wrapper"
        tabindex="0"
        @click="$emit('open-task-detail')"
        @blur="$emit('close-task-detail')"
    >
        <a class="list-item">
            <BaseCheckbox
                class="checkbox"
                :value="task.isFinish"
                @update:value="
                    $emit('update:task', { ...task, isFinish: $event })
                "
                @click.stop
            />
            <HomeStartTimer
                class="start-timer"
                :value="isTimeStart"
                @update:value="$emit('play-tomato', isTimeStart)"
            />
            <section class="content">
                <input
                    v-show="isEdit"
                    ref="input"
                    type="text"
                    class="text"
                    :value="task.name"
                    @input="
                        $emit('update:task', {
                            ...task,
                            name: $event.target.value,
                        })
                    "
                    @blur="isEdit = false"
                    @click.stop
                />

                <span v-show="!isEdit" class="text" @dblclick="focusInput">{{
                    task.name
                }}</span>
                <HomeListClocks
                    :total-expect-time="task.totalExpectTime"
                    :tomato-time="task.tomatoTime"
                    @click.stop
                />
            </section>
            <p class="date">
                {{
                    formatTimestamp({
                        timestampSecond: task.createAt.seconds,
                    })
                }}
            </p>
        </a>
    </li>
</template>

<style scoped lang="scss">
.home-list .list-item-wrapper {
    display: block;
    cursor: pointer;

    &:not(:last-child) {
        margin-bottom: 6px;
    }
}

.home-list .list-item {
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

    .start-timer {
        flex: 0 1 auto;
    }

    .content {
        flex: 0 1 auto;

        .text {
            width: 100%;
            margin-bottom: 4px;

            font-size: 12px;
            line-height: 18px;
        }

        input.text {
            background-color: $gray-1;
        }

        .timers {
            font-size: 0;

            & > *:not(:last-child) {
                margin-right: 4px;
            }
        }
    }

    .date {
        flex: 0 1 auto;
        margin-left: auto;

        font-size: 12px;
        line-height: 18px;
        color: $gray-3;
    }
}
</style>
