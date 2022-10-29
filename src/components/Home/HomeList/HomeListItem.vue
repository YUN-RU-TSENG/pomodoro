<script setup>
import { ref, watch } from 'vue'
import { formatDate } from '@/utils/dayjsFormat'

/*========== component props ========== */

const props = defineProps({
    pomodoroSelectedTaskId: {
        type: String,
        required: true,
    },
    pomodoroSettings: {
        type: Object,
        required: true,
    },
    task: {
        type: Object,
        required: true,
    },
    cacheUpdateTaskId: {
        type: String,
        required: true,
    },
})

/*========== component emit ========== */

const emit = defineEmits([
    'update:pomodoroSelectedTaskId',
    'update:cacheUpdateTaskId',
])

/* ========== component logic ========== */

// 當點中非 HomeListItem、非 HomeTaskEditBar 時，清空選中任務
useClearSelectCacheUpdateIdWhenClickWhiteSpace({ emit })

/*========== component scoped composables function ========== */

// 當點中非 HomeListItem、非 HomeTaskEditBar 時，清空選中任務(清空選擇任務，同時依賴選擇任務顯示的 HomeTaskEditBar 就會關閉)
function useClearSelectCacheUpdateIdWhenClickWhiteSpace({ emit }) {
    const isAddEventListener = ref(false)

    // 當點中非 HomeListItem、非 HomeTaskEditBar 時，清空選中任務
    const resetCacheUpdateTaskId = (e) => {
        const isInHomeListItem = !!e.target.closest('.list-item-wrapper')
        const isInTaskDetailEditor = !!e.target.closest('.home-task-edit-box')

        if (!isInHomeListItem && !isInTaskDetailEditor) {
            emit('update:cacheUpdateTaskId', '')
        }
    }

    watch(
        () => props.cacheUpdateTaskId,
        (newValue) => {
            // 當有選中任務時且無監聽點擊時，註冊點擊事件監聽(點中非目標元素，清空選中任務)
            if (newValue && !isAddEventListener.value) {
                isAddEventListener.value = true
                document.addEventListener('click', resetCacheUpdateTaskId)
            }
            // 當無選中任務且已有監聽點擊事件時，取消既有的事件監聽
            if (!newValue && isAddEventListener.value) {
                isAddEventListener.value = false
                document.removeEventListener('click', resetCacheUpdateTaskId)
            }
        }
    )
}
</script>

<template>
    <li
        class="list-item-wrapper"
        tabindex="0"
        @click="$emit('update:cacheUpdateTaskId', task.id)"
    >
        <a class="list-item">
            <HomeStartTimer
                :id="'pomodoro-selected-task' + task.id"
                class="start-timer"
                name="pomodoro-selected-task"
                :value="task.id"
                :checked-value="pomodoroSelectedTaskId"
                @update:value="$emit('update:pomodoroSelectedTaskId', task.id)"
            />
            <section class="content">
                <span class="text">{{ task.name }}</span>
                <HomeListClocks
                    :total-expect-time="task.totalExpectTime"
                    :pomodoro-settings="pomodoroSettings"
                    @click.stop
                />
            </section>
            <p class="date">
                {{
                    task.expectEndDate
                        ? formatDate({
                              date: task.expectEndDate,
                          })
                        : '未指定完成日'
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
