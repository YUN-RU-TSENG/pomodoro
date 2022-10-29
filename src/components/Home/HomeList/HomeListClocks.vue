<script setup>
import { computed } from 'vue'
import { useCovertBetweenTimeAndPomodoro } from '@/composables/useCovertBetweenTimeAndPomodoro'

/*========== component props ========== */

const props = defineProps({
    totalExpectTime: {
        type: Number,
        required: true,
    },
    pomodoroSettings: {
        type: Object,
        required: true,
    },
})

/*========== component logic ========== */

const { covertTimeToPomodoro } = useCovertBetweenTimeAndPomodoro()

const currentPomodoro = computed(() => {
    return covertTimeToPomodoro({
        time: props.totalExpectTime,
        pomodoroTime: props.pomodoroSettings.pomodoro,
    })
})
</script>

<template>
    <div class="timers">
        <template v-if="currentPomodoro <= 7">
            <img
                v-for="index of Math.floor(currentPomodoro)"
                :key="index"
                src="@/assets/images/retro-alarm-clock.png"
                width="12"
            />
        </template>
        <template v-else>
            <img src="@/assets/images/retro-alarm-clock.png" width="12" />
            <span class="counts">{{ currentPomodoro }}</span>
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
