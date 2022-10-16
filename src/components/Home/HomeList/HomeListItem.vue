<script setup>
import { ref, nextTick, watch } from 'vue'
import { formaDate } from '@/utils/dayjsFormat'

const props = defineProps({
    pomorodoSelectedTaskId: {
        type: String,
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

const emits = defineEmits([
    'update:task',
    'update:pomorodoSelectedTaskId',
    'update:cacheUpdateTaskId',
])

// ========== component logic ==========

// 當點中非 HomeListItem、非 HomeTaskEditBar 時，清空選中任務
useClearSelectCacheUpdateIdWhenClickWhiteSpace({ emits })

// 當顯示 editInputRef element 時，自動將 editInputRef element focus
const { focusInput, isEdit, editInputRef } = useFocusInput()

// ========== component scoped composables function ==========

// 當顯示 editInputRef 時，自動將 editInputRef focus
function useFocusInput() {
    const isEdit = ref(false)
    const editInputRef = ref(null)

    function focusInput() {
        isEdit.value = true

        // 確認 input 已經在 isEdit true 後渲染，再 focus
        nextTick(() => {
            editInputRef.value?.focus()
        })
    }
    return { focusInput, isEdit, editInputRef }
}

// 當點中非 HomeListItem、非 HomeTaskEditBar 時，清空選中任務(清空選擇任務，同時依賴選擇任務顯示的 HomeTaskEditBar 就會關閉)
function useClearSelectCacheUpdateIdWhenClickWhiteSpace({ emits }) {
    const isAddEventListener = ref(false)

    // 當點中非 HomeListItem、非 HomeTaskEditBar 時，清空選中任務
    const resetCacheUpdateTaskId = (e) => {
        const isInHomeListItem = !!e.target.closest('.list-item-wrapper')
        const isInTaskDetailEditor = !!e.target.closest('.home-task-edit-box')

        if (!isInHomeListItem && !isInTaskDetailEditor) {
            emits('update:cacheUpdateTaskId', '')
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
            <BaseCheckbox
                class="checkbox"
                :value="task.isFinish"
                @update:value="
                    $emit('update:task', { ...task, isFinish: $event })
                "
                @click.stop
            />
            <HomeStartTimer
                :id="'poromodo-selected-task' + task.id"
                class="start-timer"
                name="poromodo-selected-task"
                :value="task.id"
                :checked-value="pomorodoSelectedTaskId"
                @update:value="$emit('update:pomorodoSelectedTaskId', task.id)"
            />
            <section class="content">
                <input
                    v-show="isEdit"
                    ref="editInputRef"
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
                    :pomorodo-time="task.pomorodoTime"
                    @click.stop
                />
            </section>
            <p class="date">
                {{
                    task.expectEndDate
                        ? formaDate({
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
