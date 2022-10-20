<script setup>
import { computed, ref } from 'vue'
import getImageUrl from '@/utils/getImageUrl'
import { useCovertBetweenTimeAndPomorodo } from '@/composables/useCovertBetweenTimeAndPomorodo'

/* ========== component props ========== */

const props = defineProps({
    pomorodoSettings: {
        type: Object,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
})

/* ========== component emits ========== */

defineEmits(['update:value'])

/* ========== component logic ========== */

// 轉換 pomorodo 與 time(second)
const { covertTimeToPomorodo, covertPomorodoToTime } =
    useCovertBetweenTimeAndPomorodo()

// 任務總時間快取，由於可以另外選擇使用 modal input，故需要此快取值
const cacheTotalExpectTime = ref(0)

// 清除任務總時間快取
const resetCacheTotalExpectTime = () => {
    cacheTotalExpectTime.value = 0
}

// 當前任務總時間對應的 pomorodo 數量
const currentTimeToPomorodo = computed(() => {
    return covertTimeToPomorodo({
        time: props.value,
        pomorodoTime: props.pomorodoSettings.pomorodo,
    })
})

// 當選中 N 個 pomorodo 時，符合選中數量的 pomorodo 呈現紅色
const currentClockStyle = computed(() => (index) => {
    if (index <= currentTimeToPomorodo.value)
        return getImageUrl('retro-alarm-clock-red.png')
    return getImageUrl('retro-alarm-clock.png')
})
</script>

<template>
    <div class="home-add-task-clock">
        <!-- UI logic - pomorodo 小於 5 時，畫面呈現 5 個時鐘 -->
        <template v-if="currentTimeToPomorodo <= 5">
            <button
                v-for="index of 5"
                :key="index"
                class="watch"
                @click.prevent="
                    $emit(
                        'update:value',
                        covertPomorodoToTime({
                            pomorodo: index,
                            pomorodoTime: pomorodoSettings.pomorodo,
                        })
                    )
                "
            >
                <img :src="currentClockStyle(index)" width="22" />
            </button>
        </template>
        <!-- UI logic - pomorodo 大於 5 時，呈現 1 個時鐘加上 pomorodo 數量 -->
        <template v-else>
            <button v-for="index of 1" :key="index" class="watch">
                <img :src="currentClockStyle(index)" width="22" />
            </button>
            <p class="count">
                {{ currentTimeToPomorodo }}
            </p>
        </template>
        <BasePopover width="200px">
            <template #button>
                <button class="arrow add-task-button" type="button">
                    <img
                        src="@/assets/images/external-arrow-arrows-dreamstale-lineal-dreamstale-5.png"
                        width="12"
                    />
                </button>
            </template>
            <template #model="slotProps">
                <div>
                    <input
                        v-model.number="cacheTotalExpectTime"
                        type="number"
                        class="total-time-input"
                        min="0"
                        max="30"
                        placeholder="輸入 0~ 30 間的數字"
                    />
                    <section class="mention-check">
                        <BaseButton
                            color="primary"
                            @click.prevent="
                                $emit(
                                    'update:value',
                                    covertPomorodoToTime({
                                        pomorodo: cacheTotalExpectTime,
                                        pomorodoTime: pomorodoSettings.pomorodo,
                                    })
                                ),
                                    slotProps.close(),
                                    resetCacheTotalExpectTime()
                            "
                        >
                            確定
                        </BaseButton>
                        <BaseButton
                            @click.prevent="
                                slotProps.close(), resetCacheTotalExpectTime()
                            "
                        >
                            取消
                        </BaseButton>
                    </section>
                </div>
            </template>
        </BasePopover>
    </div>
</template>

<style scoped lang="scss">
.home-add-task-clock {
    line-height: 0px;

    button {
        vertical-align: middle;
    }

    .watch {
        font-size: 0px;
        margin-right: 4px;
    }

    .count {
        display: inline-block;
        font-size: 12px;
        line-height: 16px;
        margin-right: 4px;
        margin-left: 4px;
    }

    .arrow {
        padding: 5px;
        font-size: 0;
    }

    .number-input {
        margin-bottom: 12px;
    }

    .mention-check {
        display: flex;
        justify-content: space-between;
    }

    .total-time-input {
        width: 100%;
        padding: 6px;
        margin-bottom: 12px;

        border: 1px solid $gray-1;
        border-radius: 4px;
        font-size: 14px;
        line-height: 21px;
        transition: all 0.3s ease;
    }

    &:focus {
        border: 1px solid $gray-3;
    }
}
</style>
