<script setup>
import { computed } from 'vue'
import { useCovertBetweenTimeAndPomorodo } from '@/composables/useCovertBetweenTimeAndPomorodo'

const props = defineProps({
    totalExpectTime: {
        type: Number,
        required: true,
    },
    pomorodoSettings: {
        type: Object,
        required: true,
    },
})

const { covertTimeToPomorodo } = useCovertBetweenTimeAndPomorodo()

const currentPomorodo = computed(() => {
    return covertTimeToPomorodo({
        time: props.totalExpectTime,
        pomorodoTime: props.pomorodoSettings.pomorodo,
    })
})
</script>

<template>
    <div class="timers">
        <template v-if="currentPomorodo <= 7">
            <img
                v-for="index of currentPomorodo"
                :key="index"
                src="@/assets/images/retro-alarm-clock.png"
                width="12"
            />
        </template>
        <template v-else>
            <img src="@/assets/images/retro-alarm-clock.png" width="12" />
            <span class="counts">{{ currentPomorodo }}</span>
        </template>
    </div>
</template>

<style scoped lang="scss">
.timers {
    font-size: 0;

    .counts {
        vertical-align: middle;
        font-size: 12px;
        line-height: 16px;
    }

    img {
        vertical-align: middle;
        margin-right: 4px;
    }
}
</style>
