<script setup>
import { computed } from 'vue'
import { useCalender } from '@/composables/useCalender'
import dayjs from 'dayjs'

/* ========== component props ========== */

const props = defineProps({
    value: {
        type: null,
        default: null,
    },
    min: {
        type: null,
        default: null,
    },
    max: {
        type: null,
        default: null,
    },
})

/* ========== component emit ========== */

defineEmits(['cancel', 'confirm', 'update:value'])

/* ========== component logic ========== */

// calender state
const {
    currentMonth,
    currentYear,
    currentDate,
    currentMonthFirstDayOfWeek,
    updateCurrentTime,
} = useCalender()

// time 是否是位在限制時間內（最早時間、最晚時間）
const isOverTheLimitedPeriod = computed(() => (time) => {
    const now = dayjs(time)
    let isOverEarliestDeadline, isOverLatestDeadline

    // 當有最早時間，計算是否在限制時間內
    if (props.min && now.isBefore(dayjs(props.min), 'day')) {
        isOverEarliestDeadline = true
    }

    // 當有最晚時間，計算是否在限制時間內
    if (props.max && now.isAfter(dayjs(props.max), 'day')) {
        isOverLatestDeadline = true
    }

    return isOverEarliestDeadline || isOverLatestDeadline
})
</script>

<template>
    <section class="home-calender">
        <header>
            <button class="calender-arrow" @click="updateCurrentTime(-1)">
                <img
                    src="@/assets/images/circled-chevron-left.png"
                    width="20"
                />
            </button>
            <h4 class="calender-years">
                {{ currentMonth + ' ' + currentYear }}
            </h4>
            <button class="calender-arrow" @click="updateCurrentTime(1)">
                <img
                    src="@/assets/images/circled-chevron-right.png"
                    width="20"
                />
            </button>
        </header>
        <main>
            <div class="week">
                <div class="week-day">Sun</div>
                <div class="week-day">Mon</div>
                <div class="week-day">Tue</div>
                <div class="week-day">Wed</div>
                <div class="week-day">Thu</div>
                <div class="week-day">Fri</div>
                <div class="week-day">Sat</div>
            </div>
            <div class="date">
                <template v-if="currentMonthFirstDayOfWeek > 0">
                    <button
                        v-for="date of currentMonthFirstDayOfWeek"
                        :key="date"
                        class="date-day"
                    ></button>
                </template>
                <template v-for="date of currentDate" :key="date">
                    <button
                        :class="[
                            'date-day',
                            'hover',
                            date == dayjs(value).format('DD') ? 'active' : '',
                            isOverTheLimitedPeriod(
                                `${currentYear}/${currentMonth}/${date}`
                            )
                                ? 'disable'
                                : '',
                        ]"
                        @click="
                            $emit(
                                'update:value',
                                dayjs(
                                    currentYear +
                                        ' ' +
                                        currentMonth +
                                        ' ' +
                                        date,
                                    'YYYY MMM DD'
                                ).toISOString()
                            )
                        "
                    >
                        {{ date }}
                    </button>
                </template>
            </div>
        </main>
    </section>
    <section class="mention-check">
        <BaseButton color="primary" @click.prevent="$emit('confirm')">
            確定
        </BaseButton>
        <BaseButton @click.prevent="$emit('cancel')">取消</BaseButton>
    </section>
</template>

<style scoped lang="scss">
.home-calender {
    button {
        font-size: 0;
    }
}

.home-calender header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .calender-years {
        font-size: 14px;
        line-height: 21px;
        color: $gray-3;
    }
}
.home-calender main {
    font-size: 12px;
    line-height: 18px;

    .week {
        margin-bottom: 12px;

        div {
            text-align: center;
            display: inline-block;
            width: 14.28%;
            padding: 6px 0;
        }
    }

    .date {
        // display: flex;
        // flex-wrap: wrap;
        margin-bottom: 12px;

        button {
            width: 14.28%;
            padding: 2.5px 0;

            font-size: 14px;
            line-height: 21px;
            text-align: center;
            transition: all 0.3s ease;

            border-radius: 50%;
            &.hover:hover,
            &.active {
                background-color: $green-1;
                color: $white-1;
            }
            &.disable,
            &.disable:hover {
                background-color: $gray-1;
                color: $gray-3;
                cursor: not-allowed;
            }
        }
    }
}

.mention-time {
    margin-bottom: 12px;
}
.mention-check {
    display: flex;
    justify-content: space-between;
}
</style>
