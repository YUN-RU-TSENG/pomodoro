<script setup>
import { computed } from 'vue'
import { useCovertBetweenTimeAndTomato } from '@/composables/useCovertBetweenTimeAndTomato'

const props = defineProps({
    totalExpectTime: {
        type: Number,
        required: true,
    },
    tomatoTime: {
        type: Number,
        required: true,
    },
})

const { covertTimeToTomato } = useCovertBetweenTimeAndTomato()

const currentTomato = computed(() => {
    return covertTimeToTomato({
        time: props.totalExpectTime,
        tomatoTime: props.tomatoTime,
    })
})
</script>

<template>
    <div class="timers">
        <template v-if="currentTomato <= 7">
            <img
                v-for="index of currentTomato"
                :key="index"
                src="@/assets/images/retro-alarm-clock.png"
                width="12"
                alt=""
            />
        </template>
        <template v-else>
            <img
                src="@/assets/images/retro-alarm-clock.png"
                width="12"
                alt=""
            />
            <span class="counts">{{ currentTomato }}</span>
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
