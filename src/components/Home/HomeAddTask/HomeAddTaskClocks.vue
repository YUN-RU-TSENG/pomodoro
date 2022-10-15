<script setup>
import { computed } from 'vue'
import getImageUrl from '@/utils/getImageUrl'
import { useCovertBetweenTimeAndPomorodo } from '@/composables/useCovertBetweenTimeAndPomorodo'

const props = defineProps({
    pomorodoTime: {
        type: Number,
        required: true,
    },
    totalExpectTime: {
        type: Number,
        required: true,
    },
})

defineEmits(['update:totalExpectTime'])

const { covertTimeToPomorodo, covertPomorodoToTime } =
    useCovertBetweenTimeAndPomorodo()

const currentPomorodo = computed(() => {
    return covertTimeToPomorodo({
        time: props.totalExpectTime,
        pomorodoTime: props.pomorodoTime,
    })
})

// 傳入大於時鐘 index 的時候時中呈現紅色
const currentClockStyle = computed(() => (index) => {
    if (index <= currentPomorodo.value)
        return getImageUrl('retro-alarm-clock-red.png')
    return getImageUrl('retro-alarm-clock.png')
})
</script>

<template>
    <!-- 傳入小於五的數值變化呈現五個時鐘 -->
    <template v-if="currentPomorodo <= 5">
        <button
            v-for="index of 5"
            :key="index"
            class="watch"
            @click.prevent="
                $emit(
                    'update:totalExpectTime',
                    covertPomorodoToTime({ pomorodo: index, pomorodoTime })
                )
            "
        >
            <img :src="currentClockStyle(index)" width="22" />
        </button>
    </template>
    <!-- 傳入大於五的數值變化呈現一個時鐘加上數字 -->
    <template v-else>
        <button v-for="index of 1" :key="index" class="watch">
            <img :src="currentClockStyle(index)" width="22" />
        </button>
        <p class="count">{{ currentPomorodo }}</p>
    </template>
</template>

<style scoped lang="scss">
.watch {
    font-size: 0px;
    margin-right: 4px;
}
.count {
    font-size: 12px;
    line-height: 16px;
    margin-right: 4px;
}
</style>
