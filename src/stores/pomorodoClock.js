import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import dayjs from 'dayjs'
import { useToggleComponent } from '@/composables/useToggleComponent'
import { usePomorodoSetting } from '@/stores/pomorodoSetting'
import { useTasksStore } from '@/stores/tasks'

export const usePomorodoClockStore = defineStore('pomorodoClock', () => {
    // pomorodoSettingStore
    const pomorodoSettingStore = usePomorodoSetting()

    // tasksStore
    const tasksStore = useTasksStore()

    // pomorodo timer
    const timer = ref({
        pomorodo: 45 * 60, // pomorodo 時長(秒)
        breakTime: 5 * 60, // breakTime 時長(秒)
        longBreakTime: 15 * 60, // longBreakTime 時長(秒)
        longBreakInterval: 4 * 60, // longBreakTime 間隔回數
        currentInterval: 0, // 當前回數
        isStart: false, // 是否正在倒數
        mode: 'pomorodo', // 當前模式，分為 pomorodo、longBreakTime、breakTime
        countDownTime: null, // 倒數計時的時間(秒)
    })

    const {
        visible: isShowPomorodoModal,
        open: openPomorodoModal,
        close: closePomorodoModal,
        toggle: togglePomorodoModal,
    } = useToggleComponent()

    // 選擇任務 id
    const selectedTaskId = ref('')

    // 選擇任務
    const { selectedTask } = useSelectedTask({ tasksStore, selectedTaskId })

    // interval ID
    const intervalId = ref(null)

    // 開始 Pomorodo
    const { startPomorodo } = useStartPomorodo({
        intervalId,
        timer,
    })

    // 暫停 Pomorodo
    const { stopPomorodo } = useStopPomorodo({ intervalId, timer })

    // 終止 Pomorodo
    const { breakPomorodo } = useBreakPomorodo({
        intervalId,
        timer,
    })

    // 當選擇任一 task，自動開始 Pomorodo
    useWatchTaskToAutoStartPomorodo({
        startPomorodo,
        timer,
        selectedTaskId,
        intervalId,
        isShowPomorodoModal,
        pomorodoSettingStore,
    })

    return {
        selectedTaskId,
        selectedTask,
        timer,
        startPomorodo,
        stopPomorodo,
        breakPomorodo,
        isShowPomorodoModal,
        openPomorodoModal,
        closePomorodoModal,
        togglePomorodoModal,
    }
})

/**
 * 當有選擇 task 時自動開始 pomorodo
 */
function useWatchTaskToAutoStartPomorodo({
    startPomorodo,
    timer,
    selectedTaskId,
    intervalId,
    isShowPomorodoModal,
    pomorodoSettingStore,
}) {
    watch(selectedTaskId, (newSelectedTaskId, oldSelectedTaskId) => {
        // 是否成功預加載番茄鐘用戶設置，無則跳出，並顯示錯誤
        if (pomorodoSettingStore.isLoadingPomorodoSettingGet) return

        // 是否成功預加載番茄鐘用戶設置，無則跳出，並顯示錯誤
        if (pomorodoSettingStore.errorOfPomorodoSettingGet) return

        // 先前有選擇任務 -->
        if (oldSelectedTaskId) {
            // - 1. interval 清空
            clearInterval(intervalId.value)

            // - 2. 重置相關 pomorodo - countDown、isStart
            timer.value = {
                ...timer.value,
                mode: 'pomorodo',
                isStart: false,
                countDownTime: null,
            }
        }
        // <-- 先前有選擇任務

        // 當前有選擇任務 -->
        if (newSelectedTaskId) {
            // - 1. 設置 mode 為 pomorodo 的 timer countDownTime
            timer.value = {
                ...timer.value,
                mode: 'pomorodo',
                countDownTime: timer.value.pomorodo,
            }

            // - 2. 自動開始 startPomorodo
            startPomorodo()

            // - 3. 開啟番茄鐘面板，不在自動開始內開啟面板，因為只有透過選擇任務開啟番茄鐘時，會自動開啟面板
            isShowPomorodoModal.value = true
        }
        // <-- 當前有選擇任務
    })
}

/**
 * 開始 pomorodo
 */
function useStartPomorodo({ intervalId, timer }) {
    const startPomorodo = () => {
        timer.value.isStart = true
        const countDownDate = dayjs().add(timer.value.countDownTime, 'second')

        intervalId.value = setInterval(() => {
            timer.value.countDownTime = countDownDate.diff(dayjs(), 'second')

            // --未倒數完成--
            // 不執行下方程式碼
            if (timer.value.countDownTime > 0) return

            // --倒數完成--
            // 清除當前倒數
            clearInterval(intervalId.value)

            // 當當前 mode 為 pomorodo，增加執行回數
            if (timer.value.mode === 'pomorodo')
                timer.value.currentInterval += 1

            // 執行其他完成倒數的任務，如鈴聲、打 API
            console.log('music')
            console.log('API')

            // 是否切換長休息
            const isLongBreakInterval =
                timer.value.currentInterval % timer.value.longBreakInterval ===
                0

            if (isLongBreakInterval) {
                timer.value = {
                    ...timer.value,
                    mode: 'longBreakTime',
                    countDownTime: timer.value.longBreakTime,
                    isStart: false,
                }
            } else if (timer.value.mode === 'pomorodo') {
                timer.value = {
                    ...timer.value,
                    mode: 'breakTime',
                    countDownTime: timer.value.breakTime,
                    isStart: false,
                }
            } else {
                timer.value = {
                    ...timer.value,
                    mode: 'pomorodo',
                    countDownTime: timer.value.pomorodo,
                    isStart: false,
                }
            }

            // 依據用戶設置判斷是否自動執行下一次的 pomorodo
            startPomorodo()
        }, 300)
    }

    return {
        startPomorodo,
    }
}

/**
 * 停止當前 pomorodo
 */
function useStopPomorodo({ intervalId, timer }) {
    const stopPomorodo = () => {
        clearInterval(intervalId.value)

        timer.value = {
            ...timer.value,
            isStart: false,
        }
    }

    return {
        stopPomorodo,
    }
}

/**
 * 終止當前 pomorodo
 */
function useBreakPomorodo({ intervalId, timer }) {
    const breakPomorodo = () => {
        clearInterval(intervalId.value)

        timer.value = {
            ...timer.value,
            mode: 'pomorodo',
            countDownTime: timer.value.pomorodo,
            isStart: false,
        }
    }

    return {
        breakPomorodo,
    }
}

/**
 * 依照 selectedTaskId 返回 task 狀態
 */
function useSelectedTask({ tasksStore, selectedTaskId }) {
    const selectedTask = computed(() => {
        let result = tasksStore.tasks.filter(
            (item) => item.id === selectedTaskId.value
        )
        return result[0] ?? {}
    })

    return { selectedTask }
}
