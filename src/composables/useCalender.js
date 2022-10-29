import { computed, ref } from 'vue'
import dayjs from 'dayjs'

// calender 當月日期
export function useCalender() {
    // 當前時間
    const now = ref(dayjs())

    // 當前月份
    const currentMonth = computed(() => {
        return now.value.format('MMM')
    })

    // 當前年
    const currentYear = computed(() => {
        return now.value.year()
    })

    // 當前月份中的天數
    const currentDate = computed(() => {
        return now.value.daysInMonth()
    })

    // 當前月份第一天的星期
    const currentMonthFirstDayOfWeek = computed(() => {
        return now.value.date(1).day()
    })

    /**
     * 增減當年時間月份
     * @param {Number} updateMonth 輸入正整數是增加、負整數是減少
     */
    const updateCurrentTime = (updateMonth) => {
        if (!updateMonth) return
        if (updateMonth > 0)
            return (now.value = now.value.add(updateMonth, 'month'))
        if (updateMonth < 0)
            return (now.value = now.value.subtract(
                Math.abs(updateMonth),
                'month'
            ))
    }

    return {
        currentMonth,
        currentYear,
        currentDate,
        currentMonthFirstDayOfWeek,
        updateCurrentTime,
    }
}
